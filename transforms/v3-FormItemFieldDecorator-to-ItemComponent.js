/**
 * consider transformer order
 * 
 * do it in phases
 * v3 -> compatible
 * compatilbe -> v4
 * 
 * important code changes:
 * 
 * <Form.Item label="Description" {...formRowProps}>
    {getFieldDecorator('Description', { initialValue: connectedSFObject?.Description })(
      <Input />
    )}
  </Form.Item>

  <Form.Item label="Description"  name="..." initialValue="..."
 */

module.exports = (file, api) => {
  const j = api.jscodeshift;

  return j(file.source)
    .find(j.JSXElement)
    .filter(path => {
      // a bit hacky
      const elem = path.value.openingElement.name;
      if (elem.type !== 'JSXMemberExpression') {
        return false;
      }
      return elem.object.name === 'Form' && elem.property.name === 'Item';
    })
    .forEach(path => {
      // should assert that under JSXExpressionContainer,
      // callee.name = "getFieldDecorator"

      const childPath = j(path)
        .find(j.JSXExpressionContainer)
        .get(0).parentPath; // why need .parentPath?
      const child = childPath.value;
      const [fieldNameNode, optionsNode] = child.expression.callee.arguments;

      const inputNode = childPath.node.expression.arguments[0];

      const transformedAttributes = optionsNode.properties.map(option =>
        j.jsxAttribute(
          j.jsxIdentifier(option.key.name),
          j.jsxExpressionContainer(option.value),
        ),
      );

      const formItemPath = path.get('openingElement');
      const originalAttributes = formItemPath.node.attributes;
      // console.log(originalAttributes)

      j(formItemPath).replaceWith({
        ...formItemPath.node,
        // add label, original attributes and options in
        attributes: [
          j.jsxAttribute(j.jsxIdentifier('name'), fieldNameNode),
          ...originalAttributes,
          ...transformedAttributes,
        ],
      });

      j(childPath).replaceWith(inputNode);
    })
    .toSource();
};
