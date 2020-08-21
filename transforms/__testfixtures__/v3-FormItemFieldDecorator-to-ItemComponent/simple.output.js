class MyForm extends React.Component {
  render() {
    return (
      <Form.Item
        name='field_name'
        label="Label"
        rules={[
        {
        required: true,
        message: 'please input field name',
        },
    ]}
        initialValue={formData.field_name}>
        <Input placeholder="Question to ask in app" />
    </Form.Item>
    );
  }
}

