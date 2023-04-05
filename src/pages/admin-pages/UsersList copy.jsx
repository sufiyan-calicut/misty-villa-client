import { Table } from "antd";
import api from "../../api/axios";
import moment from "moment/moment";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import Layout from "../../components/admin-components/Layout";
import { hideLoading, showLoading } from "../../reduxToolkit/alertsReducer";

function UsersList() {
  const [users, setUsers] = useState([]);
  const memoizedUsers = useMemo(() => users, [users]);
  console.log(memoizedUsers);
  const dispatch = useDispatch();
  const getUsersData = async () => {
    try {
      dispatch(showLoading);
      const response = await api.get(`/admin/get-all-users`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("adminToken"),
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading);
    }
  };

  const changeUserStatus = async (record, status) => {
    try {
      dispatch(showLoading);
      const userId = record._id;
      console.log(record, "inside catch", record._id);

      const response = await api.post(
        `/admin/change-user-status`,
        { record: record },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("adminToken"),
          },
        }
      );
      dispatch(hideLoading);
      if (response.data.success) {
        setUsers(response.data.data);
        toast.success(response.data.message);
      }
    } catch (error) {}
  };

  useEffect(() => {
    getUsersData();
  }, []);

  useEffect(() => {});

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Join date",
      dataIndex: "createdAt",
      render: (record, text) => moment(record.createdAt).format("DD-MM-YY"),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          {!record.block && (
            <a className="anchor" onClick={() => changeUserStatus(record, "1")}>
              Block
            </a>
          )}
          {record.block && (
            <a className="anchor" onClick={() => changeUserStatus(record, "h")}>
              Unblock
            </a>
          )}
        </div>
      ),
    },
  ];
  return (
    <Layout>
      {/* <h1 className="user-header ">Userslist</h1> */}
      <Table
        columns={columns}
        dataSource={memoizedUsers}
        className="min-w-full"
      />
    </Layout>
  );
}

export default UsersList;