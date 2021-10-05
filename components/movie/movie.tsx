import React from "react";
import { IMovie } from "./movie.model";
import { Text } from "react-native";
import { View, StyleSheet, Image } from "react-native";

export default function Movie(props: IMovie) {
  return (
    <View style={styles.movie}>
      <Image
        style={styles.poster}
        source={{
          uri: `https://raw.githubusercontent.com/RyanHemrick/star_wars_app/master/public/images/${props.poster}`,
        }}
      />
      <View style={styles.movieContent}>
        <Text style={styles.movieTitle}>{props.title}</Text>
        <Text style={styles.movieEpisodeNumber}>
          Episode {props.episode_number}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  movie: {
    display: "flex",
    flexDirection: "row",
    marginVertical: 2,
    marginHorizontal: 4,
  },
  movieContent: {
    display: "flex",
    marginLeft: 10
  },
  movieTitle: {
    fontSize: 16,
  },
  movieEpisodeNumber: {
    fontSize: 12,
    fontStyle: "italic",
  },
  poster: {
    width: 64,
    height: 64,
    backgroundColor: '#dddddd'
  },
});
