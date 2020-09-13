import { Serializer } from './Serializer';

/**
 * A serializable contract to be used with `SerializableFactory` for
 * object serialization with id
 */
export interface Serializable {
  /**
   * Serialize this instance with the given serializer
   * @param serializer
   */
  serialize(serializer: Serializer): void;
}
