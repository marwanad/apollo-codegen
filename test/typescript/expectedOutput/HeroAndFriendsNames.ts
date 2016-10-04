//  This file was automatically generated and should not be edited.

/// The episodes in the Star Wars trilogy
export type Episode =
  "NEWHOPE" | /// Star Wars Episode IV: A New Hope, released in 1977.
  "EMPIRE" | /// Star Wars Episode V: The Empire Strikes Back, released in 1980.
  "JEDI" /// Star Wars Episode VI: Return of the Jedi, released in 1983.
};

export type HeroAndFriendsNamesQueryResult = {
  hero: {
    name: string,
    friends: Array<{
      name: string,
    } | null> | null,
  },
};
