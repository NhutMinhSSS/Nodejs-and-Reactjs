import React, { useState } from 'react';
import {
  Button,
  Checkbox,
  Col,
  Dropdown,
  Input,
  Layout,
  Menu,
  MenuProps,
  Modal,
  Row,
  Space,
} from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import '../../style/Modal.scss';
import { Content, Header } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import {
  MdAccountCircle,
  MdKeyboardArrowDown,
  MdLink,
  MdOutlineAdd,
  MdOutlineEventNote,
  MdOutlineFileUpload,
} from 'react-icons/md';
import iconYT from '../../img/youtube.png';
import iconGGD from '../../img/google-drive.png';
import CheckBoxMenu from '../../components/CheckBoxMenu';
import CheckBoxAll from '../../components/CheckBoxAll';
import { Options } from 'sass';

const ClassroomExercisesTeacher: React.FC = () => {
  const navigate = useNavigate();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const onCheckboxChange = (selection: string[]) => {
    console.log(selection);
  };
  const items = [
    {
      key: '1',
      label: <span className='text-lg'>Bài tập</span>,
      onClick: () => setIsPopupVisible(true),
    },
    {
      key: '2',
      label: <span className='text-lg'>Bài Kiểm Tra</span>,
      onClick: () => navigate('/createExcersice'),
    },
    {
      key: '3',
      label: <span className='text-lg'>Tài Liệu</span>,
      onClick: () => navigate('/createExcersice'),
    },
    {
      key: '4',
      label: <span className='text-lg'>Câu Hỏi</span>,
      onClick: () => navigate('/createExcersice'),
    },
  ];

  const menuCbx = [
    {
      label: 'Thực tập tốt nghiệp',
      key: '0',
    },
    {
      label: 'Cơ sở dữ liệu',
      key: '1',
    },
    {
      label: 'Đồ Án Tốt Nghiệp',
      key: '2',
    },
  ];

  const options = ['Thực tập tốt nghiệp', 'Đồ Án Tốt Nghiệp'];
  const handleMenuChange = (selectedOptions: string[]) => void {};
  const handlePopupCancel = () => {
    setIsPopupVisible(false);
  };
  const handleMenuListStudentChange = (selectedOptions: string[]) => void {};
  const ListStudent = [
    { label: 'Nguyễn Văn A', icon: <MdAccountCircle size={32} /> },
    { label: 'Nguyễn Văn B', icon: <MdAccountCircle size={32} /> },
    { label: 'Nguyễn Văn C', icon: <MdAccountCircle size={32} /> },
  ];

  return (
    <>
      <div className='flex items-center justify-center gap-x-[25rem]'>
        <div>
          <Dropdown
            overlay={
              <Menu>
                {items.map((item) => (
                  <Menu.Item key={item.key} onClick={item.onClick}>
                    {item.label}
                  </Menu.Item>
                ))}
              </Menu>
            }
            placement='bottom'
            trigger={['click']}
            overlayClassName='custom-dropdown-menu'
            overlayStyle={{
              width: '180px',
              height: '250px',
              padding: '10px',
              gap: '10px',
            }}
          >
            <Button className='px-3 py-6 rounded-3xl flex items-center text-lg gap-x-1 shadow-2xl'>
              <span>
                <MdOutlineAdd></MdOutlineAdd>
              </span>
              <span>Tạo</span>
            </Button>
          </Dropdown>
        </div>
        <div className='w-full'>
          <Link className='text-lg' to='/googleDirve'>
            Thư Mục Google Drive
          </Link>
        </div>
      </div>
      <hr className='w-full mt-3' />

      <div>
        <Modal
          visible={isPopupVisible}
          onCancel={handlePopupCancel}
          width='100%'
          footer={null}
        >
          <Row>
            <Col span={24}>
              <Header className='bg-blue-400 h-16 flex items-center '>
                <div>
                  <div className='ml-10 text-xl text-gray-200 font-sans flex items-center gap-x-3'>
                    <div className='bg-blue-300 text-indigo-500 text-2xl p-1 rounded-2xl'>
                      <MdOutlineEventNote></MdOutlineEventNote>{' '}
                    </div>
                    <div> Bài Tập</div>
                  </div>
                </div>
              </Header>
            </Col>
          </Row>
          <Row className=''>
            <Col span={17} className='p-10'>
              <div>
                <div className='border-slate-300 border-[2px] rounded-lg p-10'>
                  <div className='mb-5 '>
                    <div
                      className='relative mb-3 mt-2 px-2'
                      data-te-input-wrapper-init
                    >
                      <textarea
                        className='bg-slate-100 h-14 peer block min-h-[auto] w-full rounded-sm border-b-2 border-indigo-400 focus:border-b-[3.5px]  px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-100 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0'
                        id='exampleFormControlTextarea1'
                        placeholder='Your message'
                        style={{ resize: 'none' }}
                      ></textarea>
                      <label
                        htmlFor='exampleFormControlTextarea1'
                        className='pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary'
                      >
                        Tiêu Đề
                      </label>
                    </div>
                  </div>
                  <div
                    className='relative mb-3 mt-2 px-2'
                    data-te-input-wrapper-init
                  >
                    <textarea
                      className='h-[50vh] 2xl:max-h-[30vh]  3xl:max-h-[40vh] bg-slate-100 peer block min-h-[auto] w-full rounded-sm border-b-2 border-indigo-400 focus:border-b-[3.5px]  px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-100 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0'
                      id='exampleFormControlTextarea1'
                      placeholder='Hướng dẫn (không bắt buộc)'
                      style={{ resize: 'none' }}
                    ></textarea>
                    <label
                      htmlFor='exampleFormControlTextarea1'
                      className='pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary'
                    >
                      Hướng dẫn (không bắt buộc)
                    </label>
                  </div>
                </div>
                <div className='border-2 rounded-lg border-slate-300  mt-3 h-40  flex items-center justify-center gap-x-10'>
                  <div className='flex flex-col'>
                    <div className='text-lg bg-slate-200 rounded-full p-4 cursor-pointer'>
                      <img
                        style={{ width: '24px', height: '24px' }}
                        src={iconYT}
                        alt=''
                      />
                    </div>
                  </div>
                  <div className='text-lg bg-slate-200 rounded-full p-4 cursor-pointer'>
                    <img
                      style={{ width: '24px', height: '24px' }}
                      src={iconGGD}
                      alt=''
                    />
                  </div>
                  <div className='text-lg bg-slate-200 rounded-full p-4 cursor-pointer'>
                    <MdOutlineFileUpload size={24} />
                  </div>
                  <div className='text-lg bg-slate-200 rounded-full p-4 cursor-pointer'>
                    <MdLink size={24} />
                  </div>
                </div>
              </div>
            </Col>
            <Col span={1} className=' border-r-2 flex justify-center'>
              <div></div>
            </Col>
            <Col span={6}>
              <div className=''>
                <Row className='mt-10 flex justify-around'>
                  <div>
                    <Col span={12}>
                      <Dropdown
                        overlay={
                          <Menu className='w-full'>
                            <CheckBoxMenu
                              options={options}
                              onChange={handleMenuChange}
                            />
                          </Menu>
                        }
                        placement='bottom'
                        trigger={['click']}
                        overlayClassName='custom-dropdown-menu'
                        overlayStyle={{
                          width: '250px',
                          height: '250px',
                          padding: '10px',
                          gap: '10px',
                        }}
                      >
                        <Button
                          className='gap-x-1'
                          onClick={(e) => e.preventDefault()}
                        >
                          Chọn Phòng
                          <span>
                            {' '}
                            <MdKeyboardArrowDown />
                          </span>
                        </Button>
                      </Dropdown>
                    </Col>
                  </div>
                  <div>
                    <Col span={12}>
                      <Dropdown
                        overlay={
                          <Menu className='w-full fixed '>
                            <CheckBoxAll
                              options={ListStudent}
                              onChange={handleMenuListStudentChange}
                            />
                          </Menu>
                        }
                        placement='bottom'
                        trigger={['click']}
                        overlayClassName='custom-dropdown-menu'
                        overlayStyle={{
                          width: '240px',
                          height: '250px',
                          padding: '10px',
                          gap: '10px',
                        }}
                      >
                        <Button className='gap-x-1'>
                          Dành cho
                          <span>
                            <MdKeyboardArrowDown />
                          </span>
                        </Button>
                      </Dropdown>
                    </Col>
                  </div>
                </Row>
                <Row>
                  <Col>
                    <Dropdown>
                      <Menu className='w-full fixed '></Menu>
                    </Dropdown>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
          {/* <Space direction='vertical' style={{ width: '100%' }} size={[0, 48]}>
            <Layout className='h-[100vh]'>
              <Layout className=''>
                <Content className='p-10 '></Content>
                <Sider className=''></Sider>
              </Layout>
            </Layout>
          </Space> */}

          {/* Add your content here */}
        </Modal>
      </div>
    </>
  );
};

export default ClassroomExercisesTeacher;
