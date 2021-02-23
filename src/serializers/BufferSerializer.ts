import { strToUint8, uint8ToStr } from '@bhoos/utils';
import { StdSerializer } from './StdSerializer.js';
/**
 * Buffer based implementation for serializer. Can be used for
 * binary serialization while saving files, or communicating
 * over TCP/UDP network.
 */
export class BufferSerializer extends StdSerializer {
  private readonly buff: Buffer;

  constructor(version: number, size: number);
  constructor(version: number, buff: Buffer);
  constructor(version: number, buff: Buffer, offset: number);
  constructor(version: number, buff: Buffer | number, offset: number = 0) {
    super(version);
    if (typeof buff === 'number') {
      this.loading = false;
      this.buff = Buffer.allocUnsafe(buff);
      this.offset = 0;
    } else {
      this.loading = true;
      this.buff = buff;
      this.offset = offset;
    }
  }

  getBuffer() { return this.buff.slice(0, this.offset); }

  op = (
    size: number,
    read: (offset: number) => number,
    write: (k: number, offset: number) => number
  ) => (k: number): number => {
    if (this.loading) {
      const r = read.call(this.buff, this.offset);
      this.offset += size;
      return r;
    } else {
      this.offset = write.call(this.buff, k, this.offset);
      return k;
    }
  }

  int8 = this.op(1, Buffer.prototype.readInt8, Buffer.prototype.writeInt8);
  int16 = this.op(2, Buffer.prototype.readInt16BE, Buffer.prototype.writeInt16BE);
  int32 = this.op(4, Buffer.prototype.readInt32BE, Buffer.prototype.writeInt32BE);
  uint8 = this.op(1, Buffer.prototype.readUInt8, Buffer.prototype.writeUInt8);
  uint16 = this.op(2, Buffer.prototype.readUInt16BE, Buffer.prototype.writeUInt16BE);
  uint32 = this.op(4, Buffer.prototype.readUInt32BE, Buffer.prototype.writeUInt32BE);
  float = this.op(4, Buffer.prototype.readFloatBE, Buffer.prototype.writeFloatBE);
  double = this.op(8, Buffer.prototype.readDoubleBE, Buffer.prototype.writeDoubleBE);

  bool = (k: boolean): boolean => {
    return this.uint8(k ? 1 : 0) !== 0;
  }

  string = (k: string): string => {
    return this.trackLength((length) => {
      if (this.isLoading) {
        return uint8ToStr(this.buff, this.offset, length);
      } else {
        this.offset += strToUint8(k, this.buff, this.offset);
        return k;
      }
    });
  }
}
