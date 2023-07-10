import { Tabs } from 'antd';
import DetailTest from './DetailTest';
const { TabPane } = Tabs;

const DetailAllStudent = () => {
    return (
        <div className=" h-16 py-5  shadow-md flex flex-grow sm:grid-cols-2 max-w-full ">
            <div>
                <div className="w-screen">
                    <DetailTest />
                </div>
            </div>
        </div>
    );
};

export default DetailAllStudent;
