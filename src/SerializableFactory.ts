import { Serializable } from './Serializable';
import { Serializer } from './Serializer';

/**
 * Helper class to generate a factory that can identify the Serializable class
 * with a unique identification id. Provides a function to serialize object
 */
export class SerializableFactory {
  private serializables: {[id: number]: new () => Serializable } = {};
  register(id: number, k: new () => Serializable) {
    // @ts-expect-error
    if (k.__SERIALIZATION_ID__) {
      // @ts-expect-error
      throw new Error(`The serializable type ${k.name} is already registered. Trying to register with id ${id}, found existing id ${k.__SERIALIZATION_ID__}`);
    }

    // @ts-ignore
    k.__SERIALIZATION_ID__ = id;
    if (this.serializables[id]) {
      throw new Error(`A Serializable type ${this.serializables[id].name} is already registered with id ${id}, while trying to register ${k.name}`);
    }

    this.serializables[id] = k;
  }

  private createObject(id: number): Serializable {
    const Klass = this.serializables[id];
    if (!Klass) {
      throw new Error(`Serialization id ${id} not found. Cannot create object.`);
    }
    return new Klass();
  }

  serialize(serializer: Serializer, obj: Serializable) {
    // @ts-expect-error
    const id = serializer.int16(obj ? obj.__SERIALIZATION_ID__ : 0);
    if (id === 0) return null;
    if (serializer.isLoading) {
      obj = this.createObject(id);
      obj.serialize(serializer);
      if (obj.onCreate) obj.onCreate();
    } else {
      obj.serialize(serializer);
    }
    return obj;
  }

  bind(serializer: Serializer) {
    return this.serialize.bind(this, serializer);
  }
}
