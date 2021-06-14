import React from 'react'
// import driver from '../../../services/driver';
// import ReactPaginate from 'react-paginate';
import { Modal, Select } from 'antd';
// import { Link } from 'react-router-dom';
// import TableLoader from '../TableLoader';
import { Spin } from 'antd';
export const AssignVehicleModal = (props) => {




  console.log(props)
  const { Option } = Select;
  const { vehicleInfo } = props;
  console.log(vehicleInfo)
  return (
    <>

      <Modal
        title={'Assign Driver to ' + vehicleInfo.vehicleNumber}
        visible={props.visible}
        onOk={props.handleOk}
        onCancel={props.handleCancel}

      >  <Spin spinning={props.loading}>
          <Select
            showSearch
            style={{ width: '100%' }}
            placeholder="Select a driver"
            optionFilterProp="children"
            onChange={props.chooseDriver}
            defaultValue={vehicleInfo.driverId}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {
              props.driver.map(val => {
                return (
                  (val.isActive) ? <Option key={val.id} value={val.id}>{val.user && val.user.name?val.user.name:null}</Option> : null
                )
              })
            }
          </Select>
        </Spin>
      </Modal>


    </>
  )
}
export default AssignVehicleModal