import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, message, Input, Spin } from 'antd';
import { updateSalesforceProduct, disconnectProductFromSalesforce } from '../api';
import { useCallback } from 'react';
import { Product } from '../types';
import ConnectFormFooter from './ConnectFormFooter';
import { css } from '@emotion/core';
import { formRowProps } from './formCommon';
import useSalesforceObject from './useSalesforceObject';
import ProductCard from './ProductCard';

const SalesforceUpdateForm = Form.create<Props>({
  name: 'salesforce_integration_product_update_form',
})(({ form, product, visible, onCancel, onProductDisconnect }) => {
  const { getFieldDecorator } = form;
  const { fetching, data: connectedSFObject } = useSalesforceObject(
    product.external_info?.salesforce?.id
  );

  const updateProduct = useCallback(() => {
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      updateSalesforceProduct(product.external_info?.salesforce.id, values)
        .then(data => {
          message.success('successfully updated Salesforce product');
          onCancel();
        })
        .catch(err => {
          message.error('failed to update Salesforce product');
          console.error('update SF product', err);
        });
    });
  }, [product.id]);

  const disconnectProduct = useCallback(() => {
    disconnectProductFromSalesforce(product.id)
      .then(newProduct => {
        if (!newProduct) {
          throw Error('no confirmed item returned');
        }
        onProductDisconnect(newProduct);
        message.success('successfully disconnected product');
        onCancel();
      })
      .catch(err => {
        if (err.message) {
          message.error(err.message);
        } else {
          message.error('failed to disconnect product');
        }
      });
  }, [product.id]);

  return (
    <Modal
      title="Update Salesforce Product"
      visible={visible}
      onCancel={onCancel}
      footer={
        <ConnectFormFooter onOK={updateProduct} disconnect={disconnectProduct} cancel={onCancel} />
      }
      closable={false}
    >
      <ProductCard product={product} />
      <div
        css={css`
          margin-top: 8px;
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          padding: 10px;
        `}
      >
        <Spin spinning={fetching}>
          {/* sync form styles with the connect form */}
          <Form colon={false}>
            <Form.Item
              name='Name'
              label="Name"
              {...formRowProps}
              initialValue={connectedSFObject?.Name}
              rules={[
                {
                  required: true,
                  message: 'Name required',
                },
              ]}>
              <Input />
            </Form.Item>
            <Form.Item
              name='ProductCode'
              label="Product Code"
              {...formRowProps}
              initialValue={connectedSFObject?.ProductCode}>
              <Input />
            </Form.Item>
          </Form>
        </Spin>
      </div>
    </Modal>
  );
});

export default SalesforceUpdateForm;
