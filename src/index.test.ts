/* eslint-disable total-functions/no-unsafe-mutable-readonly-assignment */
/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statement */
// import { getNumStopsForGossip, NumberDictionary, ReadonlyMultiArray } from ".";
import numStopsForGossip from "./index";
import { TwoDArray } from "./types/index";

import * as fc from "fast-check";
const edgeCases: readonly TestCase[] = [
  [[], { answer: 0, description: "should handle no drivers or routes" }],
  [[[3]], { answer: 0, description: "should handle a single driver" }],
  [
    [
      [1, 3],
      [3, 1, 1],
    ],
    {
      answer: 3,
      description: "should handle drivers of disjoint route length",
    },
  ],
  [
    [
      [12, 23, 15, 2, 8, 20, 21, 3, 23, 3, 27, 20, 0],
      [
        21, 14, 8, 20, 10, 0, 23, 3, 24, 23, 0, 19, 14, 12, 10, 9, 12, 12, 11,
        6, 27, 5,
      ],
      [8, 18, 27, 10, 11, 22, 29, 23, 14],
      [13, 7, 14, 1, 9, 14, 16, 12, 0, 10, 13, 19, 16, 17],
      [
        24, 25, 21, 4, 6, 19, 1, 3, 26, 11, 22, 28, 14, 14, 27, 7, 20, 8, 7, 4,
        1, 8, 10, 18, 21,
      ],
      [13, 20, 26, 22, 6, 5, 6, 23, 26, 2, 21, 16, 26, 24],
      [6, 7, 17, 2, 22, 23, 21],
      [
        23, 14, 22, 28, 10, 23, 7, 21, 3, 20, 24, 23, 8, 8, 21, 13, 15, 6, 9,
        17, 27, 17, 13, 14,
      ],
      [
        23, 13, 1, 15, 5, 16, 7, 26, 22, 29, 17, 3, 14, 16, 16, 18, 6, 10, 3,
        14, 10, 17, 27, 25,
      ],
      [
        25, 28, 5, 21, 8, 10, 27, 21, 23, 28, 7, 20, 6, 6, 9, 29, 27, 26, 24, 3,
        12, 10, 21, 10, 12, 17,
      ],
      [
        26, 22, 26, 13, 10, 19, 3, 15, 2, 3, 25, 29, 25, 19, 19, 24, 1, 26, 22,
        10, 17, 19, 28, 11, 22, 2, 13,
      ],
      [8, 4, 25, 15, 20, 9, 11, 3, 19],
      [
        24, 29, 4, 17, 2, 0, 8, 19, 11, 28, 13, 4, 16, 5, 15, 25, 16, 5, 6, 1,
        0, 19, 7, 4, 6,
      ],
      [16, 25, 15, 17, 20, 27, 1, 11, 1, 18, 14, 23, 27, 25, 26, 17, 1],
    ],
    {
      answer: 16,
      description:
        "should handle large arrays of various routes that are all disjoint",
    },
  ],
  [
    [
      [0, 1, 2, 1],
      [4, 1, 0, 1],
      [1, 4, 1, 4],
      [1, 0, 1, 0],
    ],
    {
      answer: "never",
      description:
        "should handle drivers passing gossip, but never all drivers passing gossip to everyone",
    },
  ],
  [
    [
      [1, 8, 1, 8, 1],
      [1, 0, 1, 0, 1],
      [1, 1, 8, 1, 1],
      [7, 1, 2, 1, 3],
      [4, 7, 2, 7, 2],
    ],
    {
      answer: 5,
      description: "should handle drivers passing gossip at different stops",
    },
  ],
  [
    [
      [1, 8, 1, 8, 1],
      [1, 0, 1, 0, 1],
      [8, 1, 8, 1, 1],
      [7, 1, 7, 1, 1],
      [1, 7, 1, 7, 1],
    ],
    {
      answer: 5,
      description:
        "should handle drivers passing gossip, back and forth multiple times before all drivers have all gossip ",
    },
  ],
  [
    [
      [0, 1, 2],
      [1, 2, 0],
      [2, 0, 1],
    ],
    { answer: "never", description: "should handle all drivers never meeting" },
  ],
  [
    [
      [2, 1, 2, 1],
      [2, 2, 0, 6],
      [1, 2, 6, 4],
      [1, 1, 4, 0],
    ],
    {
      answer: 2,
      description:
        "should handle drivers not passing gossip at any point in time",
    },
  ],
];

type TestCase = readonly [
  TwoDArray,
  { readonly [key: string]: string | number }
];

describe("getNumStopsForGossip returns corrent number of stops or never", () => {
  it.each(edgeCases)(
    "%p .add(%j, %description, %answer)",
    (input, { answer }) => {
      const result = numStopsForGossip(input);
      expect(result).toEqual(answer);
    }
  );
});

describe("getNumStopsForGossip returns 'never' or a number", () => {
  it("should return expected value", () => {
    fc.assert(
      fc.property(fc.array(fc.array(fc.integer())), (input) => {
        const result = numStopsForGossip(input);
        expect(result === "never" || typeof result === "number").toBe(true);
      })
    );
  });
});
