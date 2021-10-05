import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Button,
  FlatList,
  ActivityIndicator,
  View,
  RefreshControl,
  Text,
  Alert,
  StyleSheet, StatusBar
} from "react-native";
import axios from "axios";
import { IMovie } from "./components/movie/movie.model";
import Movie from "./components/movie/movie";

interface AppState {
  movies: IMovie[];
  isLoading: boolean;
  filter?: MovieFilter | null;
}
interface MovieFilter {
  orderBy: FilterBy;
  order: FilterOrder;
}
enum FilterBy {
  Episode = "episode_number",
  Title = "title",
  Description = "description",
}
enum FilterOrder {
  Asc,
  Desc,
}

export default function App() {
  const [state, setState] = useState<AppState>({
    movies: [],
    filter: null,
    isLoading: false,
  });

  /**
   * Fetches data from API, returns object with movies property
   */
  const fetchMoviesFromApi = async () => {
    setState({ ...state, isLoading: true });

    // Just for testing purposes, simulates server delay
    // await new Promise((resolve) => setTimeout(resolve, 3000));
    try {
      const { data } = await axios.get<{ movies: IMovie[] }>(
        "https://raw.githubusercontent.com/RyanHemrick/star_wars_movie_app/master/movies.json"
      );

      // Setting response to state
      setState({ movies: data.movies, filter: null, isLoading: false });
    } catch (e: any) {
      setState({ movies: [], filter: null, isLoading: false });
      Alert.alert('Sorry, something went wrong. :(');
    }
  };

  /**
   * Sort by parameter, support toggle Asc & Desc
   * @param filter filter by enum value - predefined values
   */
  const sortBy = (filter: FilterBy) => {
    const sortDescending = state.filter?.order === FilterOrder.Asc;
    const movies = state.movies.sort((a: IMovie, b: IMovie) => {
      const first = (sortDescending ? a : b)[filter];
      const second = (sortDescending ? b : a)[filter];
      switch (filter) {
        case FilterBy.Episode:
          return +first - +second;
        case FilterBy.Title:
          return first.localeCompare(second);
      }
      return 0;
    });

    // Setting sorted movies to state with toggled order direction
    setState({
      ...state,
      movies: movies,
      filter: {
        orderBy: filter,
        order: sortDescending ? FilterOrder.Desc : FilterOrder.Asc,
      },
    });
  };

  // Hook for (like componentDidMount) initial data load
  useEffect(() => {
    fetchMoviesFromApi();
  }, []);

  const renderMovie = ({ item }: { item: IMovie }) => <Movie {...item} />;
  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Movies</Text>
      <SafeAreaView style={styles.flatList}>
        <FlatList
          data={state.movies}
          renderItem={renderMovie}
          // Episode number should be sufficient as a key instead of ID which is not present in response
          keyExtractor={(item: IMovie) => item.episode_number}
          refreshControl={
            <RefreshControl
              refreshing={state.isLoading}
              onRefresh={fetchMoviesFromApi}
            />
          }
        />
      </SafeAreaView>

      <View style={styles.loadingIndicator}>
        {state.isLoading ? <ActivityIndicator /> : null}
      </View>

      <View style={styles.sortButton}>
        <Button
          onPress={() => sortBy(FilterBy.Title)}
          color="#000000"
          title="Sort"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10
  },
  flatList: {
    flex: 1
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 2,
    marginVertical: 8,
  },
  loadingIndicator: {
    position: "absolute",
    top: "50%",
    left: "50%",
  },
  sortButton: {
    position: "absolute",
    bottom: 5,
    right: 10,
  },
});
