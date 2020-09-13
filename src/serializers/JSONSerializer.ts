import { StdSerializer } from './StdSerializer';

/**
 * A lax serializer based on JSON, using array to store
 * all values
 */
export class JSONSerializer extends StdSerializer {
  private source: Array<any>;

  public constructor(version: number, src?: Array<any>) {
    super(version);
    if (Array.isArray(src) && !src.length) {
      throw new Error('JSONSerializer expects an array of data but got empty array');
    }

    this.loading = !src;
    this.source = src || [];
    this.offset = 0;
  }

  /**
   * Prepare the serializer for another load cycle
   * @param source
   */
  load(source: Array<any>) {
    this.offset = 0;
    this.source = source;
    this.loading = true;
  }

  toJSON() { return this.source };
  toString() { return JSON.stringify(this.source) };

  private op = <T>(k: T): T => {
    if (this.loading) {
      return this.source[this.offset++];
    } else {
      this.source[this.offset++] = k;
      return k;
    }
  }

  uint8 = this.op;
  uint16 = this.op;
  uint32 = this.op;
  int8 = this.op;
  int16 = this.op;
  int32 = this.op;
  float = this.op;
  double = this.op;
  string = this.op;
  bool = this.op;
}
