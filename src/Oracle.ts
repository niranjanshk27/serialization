import { Serializable } from './Serializable';
import { Serializer } from './Serializer';

type SerializableClass<T extends Serializable> = (new (...args: any[]) => T) & { SERIAL_ID?: number };

/**
 * Helper class to generate a factory that can identify the Serializable class
 * with a unique identification id. Provides a function to serialize object
 */
export class Oracle {
  private serializables = new Map<number, () => Serializable>();

  static id<T extends Serializable>(k: SerializableClass<T>): number {
    return k.SERIAL_ID;
  }

  static identify<T extends Serializable>(k: T): number {
    if (k === null || k === undefined) return 0;
    return Oracle.id(k.constructor as SerializableClass<T>);
  }

  register<T extends Serializable>(id: number, k: SerializableClass<T>, ctor: () => T) {
    if (k.SERIAL_ID && k.SERIAL_ID !== id) {
      throw new Error(`Can't register Serializable ${k.name} with ${id}, it has already been registered with ${k.SERIAL_ID}`);
    }
    if (this.serializables.has(id)) {
      throw new Error(`Serializable class is already registered for ${id}`);
    }

    k.SERIAL_ID = id;
    this.serializables.set(id, ctor);
  }

  private createObject<T extends Serializable>(id: number): T {
    const ctor = this.serializables.get(id);
    if (!ctor) {
      throw new Error(`Serialization id ${id} not found. Cannot create object. Did you forget to register?`);
    }
    return ctor() as T;
  }

  serialize<T extends Serializable>(obj: T, serializer: Serializer): T {
    const id = serializer.int16(Oracle.identify(obj));
    if (id === 0) return null;

    const res = obj || this.createObject(id);
    return serializer.obj(res, k => k.serialize(serializer, this));
  }
}
