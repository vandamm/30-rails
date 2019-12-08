import Node from "./node";

it("gets type TILE by default", () => {
  expect(new Node().identity).toEqual([{ type: "TILE" }]);
});

it("can accept type and id", () => {
  const node = new Node("STATION", 3);

  expect(node.identity).toEqual([{ type: "STATION", id: 3 }]);
});

it("identifies as type", () => {
  const node = new Node("STATION", 3);

  expect(node.is({ type: "STATION" })).toEqual(true);
  expect(node.is({ type: "TILE" })).toEqual(false);
});

it("identifies as type and id", () => {
  const node = new Node("STATION", 3);

  expect(node.is({ type: "STATION", id: 3 })).toEqual(true);
  expect(node.is({ type: "STATION", id: 2 })).toEqual(false);
  expect(node.is({ type: "TILE", id: 2 })).toEqual(false);
});

it("connects to other node", () => {
  const a = new Node();
  const b = new Node();

  a.linkWith(b);

  expect(a.connections).toContain(b);
  expect(b.connections).toContain(a);
});

it("should not connect to self", () => {
  const a = new Node();

  a.linkWith(a);

  expect(a.connections).not.toContain(a);
});

it("replaces all connections on merge", () => {
  const a = new Node();
  const b = new Node();
  const c = new Node();

  // a-b
  a.linkWith(b);
  // c-b
  a.replaceWith(c);

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
  b1.replaceWith(a2);

  expect(b2.connections).not.toContain(b1);
  expect(b1.connections).not.toContain(b2);

  expect(a2.connections).toContain(b2);
  expect(b2.connections).toContain(a2);
});

it("Retains identitiy on merge", () => {
  const a = new Node("STATION", 1);
  const b = new Node("MOUNTAIN");

  a.replaceWith(b);

  expect(b.identity).toEqual(
    expect.arrayContaining([{ type: "STATION", id: 1 }, { type: "MOUNTAIN" }])
  );
});

it("should not merge with self", () => {
  const a = new Node();

  expect(() => {
    a.replaceWith(a);
  }).not.toThrow();
});
