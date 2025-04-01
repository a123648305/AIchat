import { Form, Input, Modal, Upload, Image, UploadFile } from 'antd';
import { useState } from 'react';
const { TextArea } = Input;
const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
const MapModal: React.FC<{ visible: boolean; formModel: Record<string, any>; onCancel: () => void; onConfirm: (data: Record<string, any>) => void }> = (props) => {
  const { visible, formModel, onCancel, onConfirm } = props;

  const [form] = Form.useForm();

  const addConfirm = () => {
    form.validateFields().then((values) => {
      console.log(values);
      onConfirm({ ...formModel, ...values });
    });
  };

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState([
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
  ]);
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  return (
    <Modal title="添加锚点" open={visible} onOk={addConfirm} onCancel={onCancel} okText="确认" cancelText="取消">
      <Form name="basic" form={form} initialValues={formModel} autoComplete="off">
        <Form.Item label="当前位置" name="postion">
          <span>
            经度：{formModel.position.lng} 维度: {formModel.position.lat}
          </span>
        </Form.Item>
        <Form.Item label="位置名称" name="title" rules={[{ required: true, message: '请输入位置名称!' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="位置描述" name="remark">
          <TextArea placeholder="请输入位置描述,用作辅助描述,非必填" maxLength={300} rows={4} />
        </Form.Item>
        <Form.Item label="位置图片" name="fileList">
          <Upload action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload" listType="picture-card" fileList={fileList} onPreview={handlePreview} onChange={handleChange}>
            {fileList.length >= 8 ? null : '上传图片'}
          </Upload>
          {previewImage && (
            <Image
              wrapperStyle={{ display: 'none' }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(''),
              }}
              src={previewImage}
            />
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MapModal;
