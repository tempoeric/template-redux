import { FC, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'redux-injectors';
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  notification,
  Pagination,
  Space,
  Spin,
  Table,
  Typography,
} from 'antd';
import {
  AppstoreOutlined,
  MenuOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

import { selectContactList } from 'models/contactList/selectors';
import { actions, reducer, sliceKey } from 'models/contactList/slice';
import { contactListSaga } from 'models/contactList/saga';

import { IContactData } from 'models/contactList/types';

import './styles.scss';

export const ContactList: FC = () => {
  useInjectReducer({
    key: sliceKey,
    reducer: reducer,
  });
  useInjectSaga({
    key: sliceKey,
    saga: contactListSaga,
  });

  const [form] = Form.useForm();
  const { Paragraph, Title } = Typography;

  const dispatch = useDispatch();
  const { customerList, isLoading, responseMessage } =
    useSelector(selectContactList);

  const contactListData = customerList;

  const [viewType, setViewType] = useState<'cards' | 'table'>('cards');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [currentContact, setCurrentContact] = useState<IContactData | null>(
    null
  );

  const handleEdit = (contact: IContactData) => {
    setCurrentContact(contact);
    setIsEditMode(true);
    form.setFieldsValue(contact); // Set current contact data in form
    setIsModalOpen(true);
  };

  const handleDelete = (contact: IContactData) => {
    dispatch(actions.deleteContact(contact.id as string));
  };

  const handleAddOrUpdateContact = async () => {
    try {
      const values = await form.validateFields();
      if (isEditMode && currentContact) {
        dispatch(
          actions.updateContactDetails({ id: currentContact.id, ...values })
        );
      } else {
        dispatch(actions.addContact(values));
      }

      form.resetFields();
      setIsModalOpen(false);
      setIsEditMode(false);
      setCurrentContact(null);
    } catch (error) {
      console.log('Validation Failed:', error);
    }
  };

  const contactCards = useMemo(() => {
    return Array.isArray(contactListData)
      ? contactListData.map(contact => ({
          id: contact.id,
          name: contact.name,
          email: contact.email,
          contactNumber: contact.contactNumber,
        }))
      : [];
  }, [contactListData]);

  const paginatedCards = useMemo(() => {
    const startIndex = (currentPage - 1) * 9;
    return contactCards.slice(startIndex, startIndex + 9);
  }, [contactCards, currentPage]);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Contact Number',
      dataIndex: 'contactNumber',
      key: 'contactNumber',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, contact: IContactData) => (
        <Space size="small">
          <EditOutlined onClick={() => handleEdit(contact)} />
          <DeleteOutlined onClick={() => handleDelete(contact)} />
        </Space>
      ),
    },
  ];

  useEffect(() => {
    if (contactListData === null) {
      dispatch(actions.getContactList());
    }
  }, [contactListData, dispatch]);

  useEffect(() => {
    if (responseMessage) {
      notification.success({
        message: 'Success',
        description: responseMessage,
        placement: 'topRight',
      });
      dispatch(actions.resetMessageResponse());
    }
  }, [responseMessage, dispatch]);

  return (
    <Spin spinning={isLoading} className="spinner">
      <div className="contact-list-container">
        <div className="contact-header-details">
          <div className="contact-add-new-button-container">
            <Title>Contact's Information</Title>
            <Paragraph>
              Your list of contacts appears here. To add a new contact, click on
              the Add New Contact button.
            </Paragraph>
          </div>
          <Button
            type="primary"
            onClick={() => {
              setIsEditMode(false);
              form.resetFields();
              setIsModalOpen(true);
            }}
          >
            Add New Contact
          </Button>
        </div>
        <div className="contact-view-information-button-container">
          <AppstoreOutlined
            className="contact-view-card-outlined"
            onClick={() => setViewType('cards')}
          />
          <MenuOutlined onClick={() => setViewType('table')} />
        </div>

        {viewType === 'cards' ? (
          <div>
            <div className="contact-cards-container">
              {paginatedCards.map((contact, index) => (
                <Card key={index}>
                  <div className="card-details-container">
                    <Paragraph>
                      <b>{contact?.name}</b>
                    </Paragraph>
                    <div className="card-button-container">
                      <EditOutlined onClick={() => handleEdit(contact)} />
                      <DeleteOutlined onClick={() => handleDelete(contact)} />
                    </div>
                  </div>
                  <Paragraph>{contact?.email}</Paragraph>
                  <Paragraph>{contact?.contactNumber}</Paragraph>
                </Card>
              ))}
            </div>
            <Pagination
              current={currentPage}
              pageSize={9}
              total={contactCards.length}
              onChange={page => setCurrentPage(page)}
              showSizeChanger={false}
              style={{ float: 'right', marginTop: '16px' }}
            />
          </div>
        ) : (
          <div className="contact-table-container">
            <Table dataSource={contactCards} columns={columns} rowKey="email" />
          </div>
        )}

        <Modal
          title={isEditMode ? 'Edit Contact' : 'Add New Contact'}
          open={isModalOpen}
          onOk={handleAddOrUpdateContact}
          onCancel={() => setIsModalOpen(false)}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <Input placeholder="Name" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please input a valid email!' },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="contactNumber"
              label="Contact Number"
              rules={[
                {
                  required: true,
                  message: 'Please input your contact number!',
                },
              ]}
            >
              <Input placeholder="Contact Number" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Spin>
  );
};
