import Node from "./node";

it("gets type TILE by default", () => {
  expect(new Node().type).toEqual("TILE");
});

it("can accept type and id", () => {
  const node = new Node("STATION", 3);

  expect(node.type).toEqual("STATION");
  expect(node.id).toEqual(3);
});

it("connects to other node", () => {
  const a = new Node();
  const b = new Node();

  a.linkWith(b);

  expect(a.connections).toContain(b);
  expect(b.connections).toContain(a);
});

it("replaces all connections on merge", () => {
  const a = new Node();
  const b = new Node();
  const c = new Node();

  a.linkWith(b);
  a.mergeInto(c);

  expect(a.connections).not.toContain(b);
  expect(b.connections).not.toContain(a);

  expect(b.connections).toContain(c);
  expect(c.connections).toContain(b);
});

it("handles complex connections replacement", () => {
  const a1 = new Node();
  const a2 = new Node();
  const b1 = new Node();
  const b2 = new Node();

  // a1-a2 b1-b2
  a1.linkWith(a2);
  b1.linkWith(b2);

  // a1-a2-b2
  b1.mergeInto(a2);

  expect(b2.connections).not.toContain(b1);
  expect(b1.connections).not.toContain(b2);

  expect(a2.connections).toContain(b2);
  expect(b2.connections).toContain(a2);
});
