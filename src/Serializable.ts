import { Oracle } from './Oracle.js';
import { Serializer } from './Serializer.js';

/**
 * A serializable contract to be used with `SerializableFactory` for
 * object serialization with id
 */
export interface Serializable {
  /**
   * Serialize this instance with the given serializer
   * @param serializer
   */
  serialize(serializer: Serializer, oracle: Oracle): void;
}
