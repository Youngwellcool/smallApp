# skeletons
Ӧ�ð�������� D/����/��ʦ��online2.0 --- ��ҳ


#### ����
С����Ǽ���ʵ�ַ���, �ȽϽ��鳤�б�ʹ�ùǼ�����


#### ��������

//index.json
//����Ǽ������
```
{
  "usingComponents": {
    "skeletons": "/component/skeletons/index"
  }
}
```
//�ڶ�Ӧ�� wxml�ļ������
����Ҫ���ùǼܵľ���Ԫ�������class=skeletons-rect������Ҫ���ùǼܵ�Բ�ε�Ԫ�������skeletons-circle
```
<skeletons isNodes="{{isNodes}}" isComplete="{{isComplete}}" />
```
//JS�в�����
```
  initData() {
    let postData = {
        townId: wx.getStorageSync('townId') || 87
    }
    // ��ʼ�������һ���ӿ�
    app.postAjax('https://url.com', postData).then((res) => {
      if (res.success) {
        this.setData({
          bodyData: res.data,  //ҳ��չʾ���ݵĴ����
          isNodes: true //ץȡ�ڵ���ƹǼ���
        }, () => {
          this.setData({
            isComplete: true  //�ڵ������ɣ����عǼ���
          })
        })
      } else {
        util.toast(res.msg || '���ſ�С���������Ժ�����')
      }
    }, () => {
      util.toast('���ſ�С���������Ժ�����')
    })
  },
```

#### ����

![����](https://images.gitee.com/uploads/images/2019/0928/110655_4ef6d5a1_744578.png "��Ļ��ͼ.png")

