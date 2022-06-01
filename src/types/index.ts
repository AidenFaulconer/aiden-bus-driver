import { ReadonlyRecord } from "readonly-types/dist";

export type TwoDArray = readonly ReadonlyArray<number>[];

export type NumberDictionary = ReadonlyRecord<string, ReadonlySet<number>>;

export type SetArray = ReadonlyArray<ReadonlySet<number>>;
