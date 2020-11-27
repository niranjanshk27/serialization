import { Serializable } from './Serializable';
import { Serializer } from './Serializer';

/**
 * Helper class to generate a factory that can identify the Serializable class
 * with a unique identification id. Provides a function to serialize object
 */
export class Oracle {
  private serializables = new Map<number, () => Serializable>();

  id<T extends Serializable>(k: new () => T): number {
    // @ts-ignore
    return k.__SERIAL_ID__;
  }

  identify<T extends Serializable>(k: T): number {
    if (k === null || k === undefined) return 0;
    return this.id(k.constructor as new () => T);
  }

  register<T extends Serializable>(id: number, k: new (...args: any[]) => T, ctor: () => T) {
    // @ts-ignore
    k.__SERIAL_ID__ = id;

    this.serializables.set(id, ctor);
  }

  private createObject<T extends Serializable>(id: number): T {
    const ctor = this.serializables.get(id);
    if (!ctor) {
      throw new Error(`Serialization id ${id} not found. Cannot create object. Did you forget to register ?`);
    }
    return ctor() as T;
  }

  serialize<T extends Serializable>(serializer: Serializer, obj: T): T {
    const id = serializer.int16(this.identify(obj));
    if (id === 0) return null;

    const res = obj || this.createObject(id);
    return serializer.obj(res, k => k.serialize(serializer));
  }

  bind(serializer: Serializer) {
    return this.serialize.bind(this, serializer);
  }
}
