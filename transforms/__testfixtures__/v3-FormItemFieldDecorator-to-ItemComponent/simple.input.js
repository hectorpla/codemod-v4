class MyForm extends React.Component {
  render() {
    return (
      <Form.Item label="Label">
        {getFieldDecorator('field_name', {
        rules: [
        {
        required: true,
        message: 'please input field name',
        },
    ],
      initialValue: formData.field_name,
  })(<Input placeholder="Question to ask in app" />)}
    </Form.Item>
    );
  }
}
