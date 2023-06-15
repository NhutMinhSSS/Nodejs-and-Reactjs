import { Button, Col, Dropdown, Menu, Row } from 'antd';
import { Header } from 'antd/es/layout/layout';
import {
    MdOutlineEventNote,
    MdOutlineFileUpload,
    MdLink,
    MdKeyboardArrowDown,
    MdAccountCircle,
} from 'react-icons/md';
import CheckBoxAll from '../../components/CheckBoxAll';
import CheckBoxMenu from '../../components/CheckBoxMenu';
import iconYT from '../../img/youtube.png';
import iconGGD from '../../img/google-drive.png';
const PopupCreateExercise = () => {
    const options = ['Thực tập tốt nghiệp', 'Đồ Án Tốt Nghiệp'];
    const handleMenuChange = (selectedOptions: string[]) => void {};

    const handleMenuListStudentChange = (selectedOptions: string[]) => void {};
    const ListStudent = [
        { label: 'Nguyễn Văn A', icon: <MdAccountCircle size={32} /> },
        { label: 'Nguyễn Văn B', icon: <MdAccountCircle size={32} /> },
        { label: 'Nguyễn Văn C', icon: <MdAccountCircle size={32} /> },
    ];

    return (
        <>
            <Row>
                <Col span={24}>
                    <Header className="bg-blue-400 h-16 flex items-center ">
                        <div>
                            <div className="ml-10 text-xl text-gray-200 font-sans flex items-center gap-x-3">
                                <div className="bg-blue-300 text-indigo-500 text-2xl p-1 rounded-2xl">
                                    <MdOutlineEventNote></MdOutlineEventNote>{' '}
                                </div>
                                <div> Bài Tập</div>
                            </div>
                        </div>
                    </Header>
                </Col>
            </Row>
            <Row className="">
                <Col span={17} className="p-10">
                    <div>
                        <div className="border-slate-300 border-[2px] rounded-lg p-10">
                            <div className="mb-5 ">
                                <div className="relative mb-3 mt-2 px-2" data-te-input-wrapper-init>
                                    <textarea
                                        className="bg-slate-100 h-14 peer block min-h-[auto] w-full rounded-sm border-b-2 border-indigo-400 focus:border-b-[3.5px]  px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-100 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                        id="exampleFormControlTextarea1"
                                        placeholder="Your message"
                                        style={{ resize: 'none' }}
                                    ></textarea>
                                    <label
                                        htmlFor="exampleFormControlTextarea1"
                                        className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
                                    >
                                        Tiêu Đề
                                    </label>
                                </div>
                            </div>
                            <div className="relative mb-3 mt-2 px-2" data-te-input-wrapper-init>
                                <textarea
                                    className="h-[50vh] 2xl:max-h-[30vh]  3xl:max-h-[40vh] bg-slate-100 peer block min-h-[auto] w-full rounded-sm border-b-2 border-indigo-400 focus:border-b-[3.5px]  px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-100 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                    id="exampleFormControlTextarea1"
                                    placeholder="Hướng dẫn (không bắt buộc)"
                                    style={{ resize: 'none' }}
                                ></textarea>
                                <label
                                    htmlFor="exampleFormControlTextarea1"
                                    className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
                                >
                                    Nội dung
                                </label>
                            </div>
                        </div>
                        <div className="border-2 rounded-lg border-slate-300  mt-3 h-40  flex items-center justify-center gap-x-10">
                            <div className="flex flex-col">
                                <div className="text-lg bg-slate-200 rounded-full p-4 cursor-pointer">
                                    <img
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                        }}
                                        src={iconYT}
                                        alt=""
                                    />
                                </div>
                            </div>
                            <div className="text-lg bg-slate-200 rounded-full p-4 cursor-pointer">
                                <img
                                    style={{ width: '24px', height: '24px' }}
                                    src={iconGGD}
                                    alt=""
                                />
                            </div>
                            <div className="text-lg bg-slate-200 rounded-full p-4 cursor-pointer">
                                <MdOutlineFileUpload size={24} />
                            </div>
                            <div className="text-lg bg-slate-200 rounded-full p-4 cursor-pointer">
                                <MdLink size={24} />
                            </div>
                        </div>
                    </div>
                </Col>
                <Col span={1} className=" border-r-2 flex justify-center">
                    <div></div>
                </Col>
                <Col span={6}>
                    <div className="">
                        <Row className="mt-10 flex justify-around">
                            <div>
                                <Col span={12}>
                                    <Dropdown
                                        overlay={
                                            <Menu className="w-full">
                                                <CheckBoxMenu
                                                    options={options}
                                                    onChange={handleMenuChange}
                                                />
                                            </Menu>
                                        }
                                        placement="bottom"
                                        trigger={['click']}
                                        overlayClassName="custom-dropdown-menu"
                                        overlayStyle={{
                                            width: '250px',
                                            height: '250px',
                                            padding: '10px',
                                            gap: '10px',
                                        }}
                                    >
                                        <Button
                                            className="gap-x-1"
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
                                            <Menu className="w-full fixed ">
                                                <CheckBoxAll
                                                    options={ListStudent}
                                                    onChange={handleMenuListStudentChange}
                                                />
                                            </Menu>
                                        }
                                        placement="bottom"
                                        trigger={['click']}
                                        overlayClassName="custom-dropdown-menu"
                                        overlayStyle={{
                                            width: '240px',
                                            height: '250px',
                                            padding: '10px',
                                            gap: '10px',
                                        }}
                                    >
                                        <Button className="gap-x-1">
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
                                    <Menu className="w-full fixed"></Menu>
                                </Dropdown>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        </>
    );
};

export default PopupCreateExercise;
