import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Form, Button, Col, Input, Popover, Progress, Row, Select, message } from 'antd';
import type { Store } from 'antd/es/form/interface';
import { Link, useRequest, history } from 'umi';
import type { StateType } from './service';
import { fakeRegister } from './service';

import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;

const passwordStatusMap = {
  ok: (
    <div className={styles.success}>
      <span>强度：强</span>
    </div>
  ),
  pass: (
    <div className={styles.warning}>
      <span>强度：中</span>
    </div>
  ),
  poor: (
    <div className={styles.error}>
      <span>强度：太短</span>
    </div>
  ),
};

const passwordProgressMap: {
  ok: 'success';
  pass: 'normal';
  poor: 'exception';
} = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

const Register: FC = () => {

  const [count, setCount]: [number, any] = useState(0);
  const [visible, setVisible]: [boolean, any] = useState(false);
  const [prefix, setPrefix]: [string, any] = useState('86');
  const [popover, setPopover]: [boolean, any] = useState(false);
  const confirmDirty = false;
  let interval: number | undefined;
  const [form] = Form.useForm();

  useEffect(
    () => () => {
      clearInterval(interval);
    },
    [interval],
  );

  const onGetCaptcha = () => {
    let counts = 59;
    setCount(counts);
    interval = window.setInterval(() => {
      counts -= 1;
      setCount(counts);
      if (counts === 0) {
        clearInterval(interval);
      }
    }, 1000);
  };

  const getPasswordStatus = () => {
    const value = form.getFieldValue('userPassword');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
    // ok: 'success';
    // pass: 'normal';
    // poor: 'exception';
    // ok: (
    //   <div className={styles.success}>
    //     <span>强度：强</span>
    //   </div>
    // ),
    //   pass: (
    //   <div className={styles.warning}>
    //     <span>强度：中</span>
    //   </div>
    // ),
    //   poor: (
    //   <div className={styles.error}>
    //     <span>强度：太短</span>
    //   </div>
  };

  const { loading: submitting, run: register } = useRequest<{ data: StateType }>(fakeRegister, {
    manual: true,
    onSuccess: (data, params) => {
      if (data.status === 'ok') {
        message.success('注册成功！');
        history.push({
          pathname: '/user/register-result',
          state: {
            account: params.email,
          },
        });
      }
    },
  });
  const onFinish = (values: Store) => {
    register(values);
  };

  const checkConfirm = (_: any, value: string) => {
    const promise = Promise;
    if (value && value !== form.getFieldValue('userPassword')) {
      return promise.reject('两次输入的密码不匹配!');
    }
    return promise.resolve();
  };

  const checkPassword = (_: any, value: string) => {
    const promise = Promise;
    // 没有值的情况
    if (!value) {
      setVisible(!!value);
      return promise.reject('请输入密码!');
    }
    // 有值的情况
    if (!visible) {
      setVisible(!!value);
    }
    setPopover(!popover);
    if (value.length < 6) {
      return promise.reject('密码过短!');
    }
    if (value && confirmDirty) {
      form.validateFields(['confirm']);
    }
    return promise.resolve();
  };

  const changePrefix = (value: string) => {
    setPrefix(value);
  };

  const renderPasswordProgress = () => {
    const value = form.getFieldValue('password');
    const passwordStatus = getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  return (
    <div className={styles.main}>
      <h3>用户注册</h3>
      <Form form={form} name="UserRegister" onFinish={onFinish}>
        <FormItem
          name="userAccount"
          rules={[
            {
              required: true,
              message: '请输入账户!',
            },
            {
              type: 'string',
              message: '账户格式错误!',
            },
            {
              pattern: /^([\u4e00-\u9fa5]{2,4})|([A-Za-z0-9_]{4,16})|([a-zA-Z0-9_\u4e00-\u9fa5]{4,16})$/,
              message: '账户格式错误!',
            },
          ]}
        >
          <Input size="large" placeholder="账户名" />
        </FormItem>
        <FormItem
          name="email"
          rules={[
            {
              required: true,
              message: '请输入邮箱!',
            },
            {
              type: 'email',
              pattern : /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
              message: '邮箱格式错误!',
            },
          ]}
        >
          <Input size="large" placeholder="邮箱" />
        </FormItem>
        <Popover
          getPopupContainer={(node) => {
            if (node && node.parentNode) {
              return node.parentNode as HTMLElement;
            }
            return node;
          }}
          content={
            visible && (
              <div style={{ padding: '4px 0' }}>
                {passwordStatusMap[getPasswordStatus()]}
                {renderPasswordProgress()}
                <div style={{ marginTop: 10 }}>
                  <span>请输入至少6~16位数字以及字母的字符。</span>
                </div>
              </div>
            )
          }
          overlayStyle={{ width: 240 }}
          placement="right"
          visible={visible}
        >
          <FormItem
            name="userPassword"
            className={
              form.getFieldValue('userPasswrod') &&
              form.getFieldValue('userPasswrod').length > 0 &&
              styles.password
            }
            rules={[
              {
                validator: checkPassword,
              },
              // {
              //   min: 8,
              //   type: 'string',
              //   message: '长度不能小于6',
              // },
              // {
              //   min: 16,
              //   type: 'string',
              //   message: '长度不能大于16',
              // },
              {
                pattern : /^(?=.*\d)(?=.*[A-z])[\da-zA-Z]{8,16}$/,
                type: 'string',
                message : '密码不符合规范!'
              }
            ]}
          >
            <Input size="large" type="password" placeholder="至少6位密码，区分大小写" />
          </FormItem>
        </Popover>
        <FormItem
          name="checkPassword"
          rules={[
            {
              required: true,
              message: '确认密码',
            },
            {
              validator: checkConfirm,
            },
            {
              pattern: /^(?=.*\d)(?=.*[A-z])[\da-zA-Z]{8,16}$/,
              type: 'string',
              message: '密码不符合规范!'
            }
          ]}
        >
          <Input size="large" type="password" placeholder="确认密码" />
        </FormItem>
        {/*<InputGroup compact>*/}
        {/*  <Select size="large" value={prefix} onChange={changePrefix} style={{ width: '20%' }}>*/}
        {/*    <Option value="86">+86</Option>*/}
        {/*    <Option value="87">+87</Option>*/}
        {/*  </Select>*/}
        {/*  <FormItem*/}
        {/*    style={{ width: '80%' }}*/}
        {/*    name="mobile"*/}
        {/*    rules={[*/}
        {/*      {*/}
        {/*        required: false, // 不是必填项*/}
        {/*        message: '请输入手机号!',*/}
        {/*      },*/}
        {/*      {*/}
        {/*        pattern: /^\d{11}$/,*/}
        {/*        message: '手机号格式错误!',*/}
        {/*      },*/}
        {/*    ]}*/}
        {/*  >*/}
        {/*    <Input size="large" placeholder="手机号" />*/}
        {/*  </FormItem>*/}
        {/*</InputGroup>*/}
        {/*<Row gutter={8}>*/}
        {/*  <Col span={16}>*/}
        {/*    <FormItem*/}
        {/*      name="captcha"*/}
        {/*      rules={[*/}
        {/*        {*/}
        {/*          required: true,*/}
        {/*          message: '请输入验证码!',*/}
        {/*        },*/}
        {/*      ]}*/}
        {/*    >*/}
        {/*      <Input size="large" placeholder="验证码" />*/}
        {/*    </FormItem>*/}
        {/*  </Col>*/}
        {/*  <Col span={8}>*/}
        {/*    <Button*/}
        {/*      size="large"*/}
        {/*      disabled={!!count}*/}
        {/*      className={styles.getCaptcha}*/}
        {/*      onClick={onGetCaptcha}*/}
        {/*    >*/}
        {/*      {count ? `${count} s` : '获取验证码'}*/}
        {/*    </Button>*/}
        {/*  </Col>*/}
        {/*</Row>*/}
        <FormItem>
          <Button
            size="large"
            loading={submitting}
            className={styles.submit}
            type="primary"
            htmlType="submit"
          >
            <span>注册</span>
          </Button>
          <Link className={styles.login} to="/user/login">
            <span>使用已有账户登录</span>
          </Link>
        </FormItem>
      </Form>
    </div>
  );
};
export default Register;
