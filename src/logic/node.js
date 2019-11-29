export default class Node {
  constructor(type, id) {
    this.type = type || "TILE";

    if (id) this.id = id;

    this.connections = new Set();
  }

  /**
   * Add connections between this and other node
   *
   * @param {Node} node
   * @returns {Node}
   */
  linkWith(node) {
    this.connections.add(node);
    node.connections.add(this);

    return this;
  }

  /**
   * Remove connections between this and other node
   *
   * @param {Node} node
   * @returns {Node}
   */
  unlinkFrom(node) {
    this.connections.delete(node);
    node.connections.delete(this);
  }

  /**
   * Replaces all connections to this node with connections to provided target
   *
   * @param {Node} target
   * @returns {Node}
   */
  replaceWith(target) {
    for (const node of this.connections) {
      this.unlinkFrom(node);
      target.linkWith(node);
    }

    return target;
  }
}
