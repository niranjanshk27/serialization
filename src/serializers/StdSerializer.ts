import { Serializer } from "../Serializer.js";

export abstract class StdSerializer implements Serializer {
  public readonly version: number;
  protected loading: boolean;
  protected offset: number;
  private reference: number;

  constructor(version: number) {
    this.version = version;
  }

  setIntervalReference(reference: number) {
    this.reference = reference;
  }

  /**
   * Special data type for encoding/decoding interval values.
   * In network communications, packet losses are inevitable
   * so it is possible that a packet sent at time 't' may have
   * an additional delay (ignoring latency). The interval type
   * accomodates such delay, by using a timestamp reference.
   * @param ms 
   * @returns 
   */
  interval(ms: number) {
    if (this.reference === undefined) {
      throw new Error('Interval serialization requires reference to be set first');
    }

    const k = this.uint32(this.reference);
    return this.uint32(ms) - (k - this.reference);
  }

  get length() {
    return this.offset;
  }

  track<T>(fn: () => T): T {
    const mark = this.offset;
    try {
      return fn();
    } catch (err) {
      this.offset = mark;
      throw err;
    }
  }

  trackLength(fn: (length: number) => number) {
    const mark = this.offset;
    let length = this.uint16(0);
    try {
      length = fn(length);
      if (!this.loading) {
        const tmp = this.offset;
        this.offset = mark;
        this.uint16(length);
        this.offset = tmp;
      }
      return length;
    } catch (err) {
      this.offset = mark;
      throw err;
    }
  }

  obj<T extends {}>(obj: T, serialize: (obj: T, serializer: Serializer) => void): T {
    let res = obj || {} as T;

    this.trackLength((length) => {
      const mark = this.offset;
      serialize(res, this);
      if (this.isLoading) {
        this.offset = mark + length;
      }

      return this.offset - mark;
    });

    return res;
  }

  /**
   * Array serialization with a limit
   * 
   * @param array 
   * @param offset 
   * @param serialize 
   * @returns 
   */
  larray<T>(array: T[], offset: number, serialize: (item: T, serializer: Serializer) => T): number {
    return this.trackLength((len) => {
      const length = len || (array.length - offset);
      let i = 0;
      for (; i < length; i += 1) {
        try {
          array[i + offset] = serialize(array[i + offset], this);
        } catch (err) {
          break;
        }
      }
      return i;
    });
  }

  array<T>(array: T[], serialize: (item: T, serializer: Serializer) => T): T[] {
    const res: T[] = array || [];
    this.trackLength((len) => {
      const length = len || array.length;
      for (let i = 0; i < length; i += 1) {
        res[i] = serialize(res[i], this);
      }
      return res.length
    });

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

  abstract isEmpty: boolean;
}