import { Serializer } from '../Serializer';
/**
 * Buffer based implementation for serializer. Can be used for
 * binary serialization while saving files, or communicating
 * over TCP/UDP network.
 */
export class BufferSerializer implements Serializer {
  private readonly buff: Buffer;
  public readonly version: number;
  private loading: boolean;
  private offset: number;

  constructor(version: number, buff: number | Buffer) {
    this.version = version;
    if (typeof buff === 'number') {
      this.loading = false;
      this.buff = Buffer.allocUnsafe(buff);
    } else {
      this.loading = true;
      this.buff = buff;
    }
    this.offset = 0;
  }

  getBuffer() { return this.buff; }

  end() {
    this.loading = true;
  }

  get isLoading() { return this.loading }

  op = (read: () => number, write: (k: number, offset: number) => number) => (k: number): number => {
    if (this.loading) {
      return read.call(this.buff);
    } else {
      this.offset = write.call(this.buff, k, this.offset);
      return k;
    }
  }

  int8 = this.op(Buffer.prototype.readInt8, Buffer.prototype.writeInt8);
  int16 = this.op(Buffer.prototype.readInt16BE, Buffer.prototype.writeInt16BE);
  int32 = this.op(Buffer.prototype.readInt32BE, Buffer.prototype.writeInt32BE);
  uint8 = this.op(Buffer.prototype.readUInt8, Buffer.prototype.writeUInt8);
  uint16 = this.op(Buffer.prototype.readUInt16BE, Buffer.prototype.writeUInt16BE);
  uint32 = this.op(Buffer.prototype.readUInt32BE, Buffer.prototype.writeUInt32BE);
  float = this.op(Buffer.prototype.readFloatBE, Buffer.prototype.writeFloatBE);
  double = this.op(Buffer.prototype.readDoubleBE, Buffer.prototype.writeDoubleBE);

  bool = (k: boolean): boolean => {
    return this.uint8(k ? 1 : 0) !== 0;
  }

  string = (k: string): string => {
    if (this.isLoading) {
      return this.buff.toString('utf-8');
    } else {
      this.buff.write(k, 'utf-8');
      return k;
    }
  }
}
