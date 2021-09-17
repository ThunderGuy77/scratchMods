// We use class syntax to define our extension object
// This isn't actually necessary, but it tends to look the best

class StartThunderBlocks {
  getInfo() {
    return {
      id: 'thunderblocks',

      // `name` is what the user sees in the toolbox
      // It can be changed without breaking projects.
      name: 'Thunder Blocks',

      blocks: [
        {
          // `opcode` is the internal ID of the block
          // It should never change!
          // It corresponds to the class method with the same name.
          opcode: 'hello',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Hello, world!'
        }
      ]
    };
  }

  /**
   * Corresponds to `opcode: 'hello'` above
   */
  hello() {
    // You can just return a value: any string, boolean, or number will work.
    // If you have to perform an asynchronous action like a request, just return a Promise.
    // The block will wait until the Promise resolves and return the resolved value.
    return 'Hello, world!';
  }
}

// Call Scratch.extensions.register to register your extension
// Make sure to register each extension exactly once
Scratch.extensions.register(new thunderblocks());
