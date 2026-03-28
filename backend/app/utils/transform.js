function toApiShape(doc) {
  if (doc == null) return null;
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  const id = obj._id != null ? String(obj._id) : undefined;
  delete obj._id;
  delete obj.__v;
  return id != null ? { ...obj, id } : obj;
}

function toApiList(docs) {
  return (docs || []).map(toApiShape);
}

module.exports = { toApiShape, toApiList };
