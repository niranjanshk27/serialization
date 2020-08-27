import { Serializer } from '../Serializer';

/**
 * A lax serializer based on JSON, using array to store
 * all values
 */
export class JSONSerializer implements Serializer {
  public readonly version: number;
  private loading: boolean;
  private source: Array<any>;
  private offset: number;

  public constructor(version: number, src?: Array<any>) {
    this.version = version;
    this.loading = !Boolean(src);
    this.source = src ? [...src] : [];
    this.offset = 0;
  }

  reset() {
    this.offset = 0;
    this.source = [];
    this.loading = true;
  }

  toJSON() { return this.source };
  toString() { return JSON.stringify(this.source) };

  public get isLoading() { return this.loading }

  private op = <T>(k: T): T => {
    if (this.loading) {
      this.source[this.offset] = k;
      this.offset++;
    } else {
      this.source.push(k);
    }

    return k;
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
