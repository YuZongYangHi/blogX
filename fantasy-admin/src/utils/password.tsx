// @ts-ignore
export const checkPasswordSecurityLevel = (value: string): number => {
  // 0： 表示第一个级别 1：表示第二个级别 2：表示第三个级别
  // 3： 表示第四个级别 4：表示第五个级别
  let modes = 0;

  if (value.length < 6) {//最初级别
    return modes;
  }
  if (/\d/.test(value)) {//如果用户输入的密码 包含了数字
    modes++;
  }
  if (/[a-z]/.test(value)) {//如果用户输入的密码 包含了小写的a到z
    modes++;
  }
  if (/[A-Z]/.test(value)) {//如果用户输入的密码 包含了大写的A到Z
    modes++;
  }
  if (/\W/.test(value)) {//如果是非数字 字母 下划线
    modes++;
  }
  switch (modes) {
    case 1 :
      return 1;
    case 2 :
      return 2;
    case 3 :
      return 3;
    case 4 :
      return 4;
  }
}

export const PasswordStrengthDisplay = (password: string): string => {
  const display: string[] = ["弱", "中", "强", "非常强"];
  const passwordLevel: number = checkPasswordSecurityLevel(password);
  return display[passwordLevel - 1]
}

export const PasswordStrengthDisplayComponent = (password: string): any => {
  let color: string;
  const text = PasswordStrengthDisplay(password)

  switch (checkPasswordSecurityLevel(password)) {
    case 1:
      color = "#F45A68";
      break;
    case 2:
      color = "#fc0";
      break;
    case 3:
      color = "#cc0";
      break
    case 4:
      color = "#14B12F";
      break;
  }

  // @ts-ignore
  return <span style={{color: color}}>{text}</span>
}

export const CheckEmailValid = (email: string): boolean => {
  if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email)) {
    return false;
  }
  return true;
}
