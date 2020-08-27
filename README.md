# Data Serialization
Data serialization library for communication and storage purpose with versioning

## Installation
> `yarn add @bhoos/serialization`

## Primary serialization
Use the basic function from `Serializer` for primary data type serialization:
* `int8`
* `int16`
* `int32`
* `uint8`
* `uint16`
* `uint32`
* `float`
* `double`
* `string`

Properties available in `Serializer`
* `version` The version of the serializer typically based on the app.
* `isLoading` The mode of the serializer. Based on the mode, the
data is either read (`loading`) or written.

## Standard Usage
Implement the Serializable interface
```typescript
import { Serializable, Serializer } from '@bhoos/serialization'
class ComplexNumber implements Serializable {
  real: number;
  imaginary: number;

  // Implement the serialize function
  serialize(serializer: Serializer) {
    // Assuming we used floating size number in earlier version
    // and later upgraded to double size numbers
    if (serializer.version < 2 ) {
      serializer.float(this.real);
      serializer.float(this.imaginary);
    } else {
      serializer.double(this.real);
      serailizer.double(this.imaginary);
    }
  }

  // Optionally extend onCreate to initialize object
  // after serialization creates it
  onCreate() {

  }
}
```

## Application Usage
The standard JSON and Buffer based serializers are provided
with the library. If any other format are required, they
can be created by implementing the `Serializer` interface.
```typescript
class CommunicationChannel {
  private factory = new SerializableFactor();

  constructor(version: number) {
    this.version = version;
    this.factory.register(1, ComplexNumber);
  }

  sendObject(obj: Serializable) {
    // Initialize buffer serializer for writing
    const serializer = new BufferSerializer(this.version, 1000);
    this.factory.serialize(serializer, obj);
    this.channel.send(serializer.getBuffer());
  }

  receiveObject(buffer: Buffer) {
    const serializer = new BufferSerializer(this.version, buffer);
    const obj = this.factory.serialize(serializer, null);
    return obj;
  }
}
```

## Helper functions
* `serializeArray`: Serialize an array of specific types<br/>
  1. Ex: `serializeArray(serializer.string, serializer, source)`;
  2. Ex: `serializeArray(this.factory.bind(serializer), serializer, objArray)`


