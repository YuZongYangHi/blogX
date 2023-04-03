// 是否包含表情
export const IsMatchEmo = (str: string): boolean  => {
  const regex = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig
  return regex.test(str)
}

// 是否包含特殊字符
export const IsMatchSpecial = (str: string): boolean => {
  const regex = /[`~!@#$%^&*()\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/im
  return regex.test(str)
}

// 是否包含中文
export const IsMatchCn = (str: string): boolean => {
  const regex = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;
  return regex.test(str)
}

// 是否以数字开头
export const IsMatchNumberStart = (str: string): boolean => {
  return !!str.match(/^\d/)
}

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
