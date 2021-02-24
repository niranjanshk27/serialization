import { Serializer } from "../Serializer.js";

export abstract class StdSerializer implements Serializer {
  public readonly version: number;
  protected loading: boolean;
  protected offset: number;

  constructor(version: number) {
    this.version = version;
  }

  get length() {
    return this.offset;
  }

  mark() {
    const marker = this.offset;
    return () => {
      this.offset = marker;
    }
  }

  trackLength<T>(fn: (length: number) => T) {
    const mark = this.offset;
    let length = this.uint16(0);
    const lengthMarker = this.offset;
    try {
      const r = fn(length);
      if (!this.isLoading) {
        length = this.offset - lengthMarker;
        this.offset = mark;
        this.uint16(length);
      }
      // Keep the offset at right position after tracking
      this.offset = lengthMarker + length;
      return r;
    } catch (err) {
      // Reset the offset to original position
      this.offset = mark;
      throw err;
    }
  }

  obj<T extends {}>(obj: T, serialize: (obj: T, serializer: Serializer) => void): T {
    const mark = this.offset;
    let length = this.uint16(0);
    const lengthMarker = this.offset;

    const res: T = obj || {} as T;

    serialize(res, this);

    if (!this.isLoading) {
      length = this.offset - lengthMarker;
      this.offset = mark;
      this.uint16(length);
    }

    this.offset = lengthMarker + length;

    return res;
  }

  array<T>(array: T[], serialize: (item: T, serializer: Serializer) => T): T[] {
    const res: T[] = array || [];

    const length = this.uint16(res.length);
    for (let i = 0; i < length; i += 1) {
      res[i] = serialize(res[i], this);
    }

    return res;
  }

  json<T>(k: T): T {
    if (this.isLoading) {
      return JSON.parse(this.string(''));
    } else {
      this.string(JSON.stringify(k));
      return k;
    }
  }

  end() {
    this.loading = true;
  }

  get isLoading() { return this.loading }

  abstract int8(k: number): number;
  abstract int16(k: number): number;
  abstract int32(k: number): number;
  abstract uint8(k: number): number;
  abstract uint16(k: number): number;
  abstract uint32(k: number): number;
  abstract float(k: number): number;
  abstract double(k: number): number;
  abstract bool(k: boolean): boolean;
  abstract string(k: string): string;
}