<template>
  <div class="app-container">
    <!--非浮动头部组件-->
    <div>
      <el-form class="header" :inline="true" ref="searchForm" :model="searchForm" label-width="100px">
        <el-form-item label="当前权限组">{{searchForm.name}}</el-form-item><br />
        <el-form-item label="权限组描述">{{searchForm.describe}}</el-form-item><br />
        <!--<el-form-item label="组所有权限">{{searchForm.access}}</el-form-item>-->
      </el-form>
    </div>
    <!--浮动头部组件-->
    <div class="floatContainer">
        <el-form :inline="true" ref="searchForm" :model="searchForm" label-width="100px">
          <el-form-item class="headerSelect" label="选择权限组">
            <el-select @change="remoteGroup" v-model="searchForm.id" placeholder="请选择分组名称">
              <el-option
                v-for="item in groups"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-button @click="onCreateGroup()" type="primary" class="btnFloat" icon="el-icon-edit">创建权限组</el-button>
        <el-button @click="remoteGroup()" type="danger" class="btnFloat" icon="el-icon-back">还原</el-button>
        <el-button @click="onUpdateAccess()" type="danger" class="btnFloat" icon="el-icon-edit">确认修改</el-button>
      </div>
    <!--权限板块-->
    <div>
      <!--板块一:项目核算-->
      <table class="_table tableFirst" border="0" cellpadding="0" cellspacing="0" style="width: 100%">
        <thead><tr><th>板块一 项目核算</th></tr></thead>
        <tbody><tr><td>
            <el-button type="primary" plain size="mini" class="btnPage">项目核算</el-button>
            <el-checkbox v-model="check.read_costAccounts">访问成本核算</el-checkbox>
            <el-checkbox v-model="check.update_costAccounts">成本核算-更新</el-checkbox>
            <el-checkbox v-model="check.read_profitAccounts">访问利润核算</el-checkbox>
            <el-checkbox v-model="check.update_profitAccounts">利润核算-更新</el-checkbox>
            <el-checkbox v-model="check.read_outputAccounts">访问产值核算</el-checkbox>
            <el-checkbox v-model="check.update_outputAccounts">产值核算-更新</el-checkbox>
            <el-checkbox v-model="check.read_pageDepartmentAccounts">访问部门统计</el-checkbox>
            <el-checkbox v-model="check.create_departmentAccounts">部门统计-生成报表</el-checkbox>
        </td></tr></tbody>
      </table>
      <!--版块二:综合行政-->
      <table class="_table" border="0" cellpadding="0" cellspacing="0" style="width: 100%">
        <thead><tr><th>板块二 综合行政</th></tr></thead>
        <tbody>
        <tr><td>
          <el-button type="primary" plain size="mini" class="btnPage">报销审批-我的申请</el-button>
          <el-checkbox v-model="check.create_costApply_Excel">使用Excel批量导入</el-checkbox>
        </td></tr>
        <tr><td>
            <el-button type="primary" plain size="mini" class="btnPage">报销审批-待审申请</el-button>
            <el-checkbox v-model="check.read_applyManage_pageApplyAll">访问待审申请</el-checkbox>
            <el-checkbox v-model="check.read_applyManage_All">查看全部申请</el-checkbox>
            <el-checkbox v-model="check.read_applyManage_Failed">查看失败申请</el-checkbox>
        </td></tr>
        <tr><td>
          <el-button type="primary" plain size="mini" class="btnPage">报销审批-审批流程</el-button>
          <el-checkbox v-model="check.read_pageApprovalProcess">访问审批流程</el-checkbox>
          <el-checkbox v-model="check.update_approvalJT">修改华建集团流程</el-checkbox>
          <el-checkbox v-model="check.update_approvalHJ">修改华建设计流程</el-checkbox>
          <el-checkbox v-model="check.update_approvalFH">修改富华电力流程</el-checkbox>
          <el-checkbox v-model="check.update_approvalYT">修改源通电力流程</el-checkbox>
          <el-checkbox v-model="check.update_approvalWL">修改物联流程</el-checkbox>
        </td></tr>
        <tr><td>
          <el-button type="primary" plain size="mini" class="btnPage">财务中心-金额往来</el-button>
          <el-checkbox v-model="check.read_Financial_pageApplyAll">访问财务审批</el-checkbox>
          <el-checkbox v-model="check.read_Financial_pageProofCreate">访问凭证打款</el-checkbox>
          <el-checkbox v-model="check.read_pageInvoiceApply">访问开票申请</el-checkbox>
          <el-checkbox v-model="check.read_pageReceiptConfirmation">访问收款确认</el-checkbox>
        </td></tr>
        <tr><td>
          <el-button type="primary" plain size="mini" class="btnPage">财务中心-财务报表</el-button>
          <el-checkbox v-model="check.read_pageBankFlow">访问银行流水</el-checkbox>
          <el-checkbox v-model="check.read_pageReceivable">访问应收账款</el-checkbox>
          <el-checkbox v-model="check.read_pageSummary">访问费用汇总</el-checkbox>
        </td></tr>
        <tr><td>
          <el-button type="primary" plain size="mini" class="btnPage">综合报销-报销分组</el-button>
          <el-checkbox v-model="check.read_groupCost">访问报销分组</el-checkbox>
          <el-checkbox v-model="check.create_group">创建报销分组</el-checkbox>
          <el-checkbox v-model="check.update_group">修改报销分组</el-checkbox>
        </td></tr>
        <tr><td>
          <el-button type="primary" plain size="mini" class="btnPage">综合报销-报销记录</el-button>
          <el-checkbox v-model="check.read_generalCost">访问报销记录</el-checkbox>
          <el-checkbox v-model="check.create_general">报销记录-添加记录</el-checkbox>
          <el-checkbox v-model="check.create_general_Excel">报销记录-Excel导入</el-checkbox>
          <el-checkbox v-model="check.update_general">报销记录-修改记录</el-checkbox>
          <el-checkbox v-model="check.read_generalCost_UseAndNote">报销记录-显示用途和备注</el-checkbox>
        </td></tr>
        <tr><td>
          <el-button type="primary" plain size="mini" class="btnPage">项目报销-基础报销</el-button>
            <el-checkbox v-model="check.read_basicCost">访问基础报销</el-checkbox>
            <el-checkbox v-model="check.create_costBasic">基础报销-添加单条记录</el-checkbox>
            <el-checkbox v-model="check.create_costBasic_Excel">基础报销-Excel导入</el-checkbox>
            <el-checkbox v-model="check.update_costBasic">基础报销-修改单条记录</el-checkbox>
            <el-checkbox v-model="check.read_basicCost_UseAndNote">基础报销-显示用途和备注</el-checkbox>
          </td></tr>
        <tr><td>
          <el-button type="primary" plain size="mini" class="btnPage">项目报销-物资采购</el-button>
            <el-checkbox v-model="check.read_goodsCost">访问物资采购</el-checkbox>
            <el-checkbox v-model="check.create_costGoods">物资采购-添加单条记录</el-checkbox>
            <el-checkbox v-model="check.create_costGoods_Excel">物资采购-使用Excel导入</el-checkbox>
            <el-checkbox v-model="check.update_costGoods">物资采购-修改单条记录</el-checkbox>
            <el-checkbox v-model="check.read_goodsCost_UseAndNote">物资采购-显示用途和备注</el-checkbox>
        </td></tr>
        <tr><td>
          <el-button type="primary" plain size="mini" class="btnPage">报销科目</el-button>
          <el-checkbox v-model="check.read_sbjType">访问报销科目</el-checkbox>
          <el-checkbox v-model="check.create_costSubject">新增科目</el-checkbox>
          <el-checkbox v-model="check.update_costSubject">修改科目</el-checkbox>
        </td></tr>
        <tr><td>
          <el-button type="primary" plain size="mini" class="btnPage">车辆管理</el-button>
          <el-checkbox v-model="check.read_carManage">访问车辆管理</el-checkbox>
        </td></tr>
        </tbody>
      </table>
      <!--版块三:系统设置-->
      <table class="_table" border="0" cellpadding="0" cellspacing="0" style="width: 100%">
        <thead><tr><th>板块三 系统设置</th></tr></thead>
        <tbody>
        <tr><td>
          <el-button type="primary" plain size="mini" class="btnPage">部门设置</el-button>
          <el-checkbox v-model="check.read_department">访问部门设置</el-checkbox>
          <el-checkbox v-model="check.create_department">新增部门</el-checkbox>
          <el-checkbox v-model="check.update_department_leader">设置部门负责人</el-checkbox>
        </td></tr>
        <tr><td>
          <el-button type="primary" plain size="mini" class="btnPage">员工设置</el-button>
          <el-checkbox v-model="check.read_user">访问员工设置</el-checkbox>
          <el-checkbox v-model="check.create_user">新增员工</el-checkbox>
          <el-checkbox v-model="check.update_user">修改员工</el-checkbox>
        </td></tr>
        <tr><td>
          <el-button type="primary" plain size="mini" class="btnPage">权限管理</el-button>
          <el-checkbox v-model="check.read_accessStuffs">访问员工权限</el-checkbox>
          <el-checkbox v-model="check.update_accessStuffGroup">员工权限-修改员工权限分组</el-checkbox>
          <el-checkbox v-model="check.read_accessGroup">访问权限分组</el-checkbox>
          <el-checkbox v-model="check.update_accessGroup">权限分组-修改分组拥有权限</el-checkbox>
          <el-checkbox v-model="check.create_accessGroup">权限分组-新增分组</el-checkbox>
        </td></tr>
        </tbody>
      </table>
      <!--版块四:经营管理-->
      <table class="_table" border="0" cellpadding="0" cellspacing="0" style="width: 100%">
        <thead><tr><th>板块四 经营管理</th></tr></thead>
        <tbody>
        <tr><td>
          <el-button type="primary" plain size="mini" class="btnPage">项目管理</el-button>
          <el-checkbox v-model="check.read_project">访问项目管理</el-checkbox>
          <el-checkbox v-model="check.create_project">新增项目</el-checkbox>
          <el-checkbox v-model="check.update_project">修改项目</el-checkbox>
          <el-checkbox v-model="check.delete_project">禁用项目</el-checkbox>
        </td></tr>
        <tr><td>
          <el-button type="primary" plain size="mini" class="btnPage">合同管理</el-button>
          <el-checkbox v-model="check.read_contract">访问合同管理</el-checkbox>
          <el-checkbox v-model="check.update_signStatus">修改签订状态</el-checkbox>
          <el-checkbox v-model="check.update_contractStatus">修改合同状态</el-checkbox>
        </td></tr>
        <tr><td>
          <el-button type="primary" plain size="mini" class="btnPage">开票管理</el-button>
          <el-checkbox v-model="check.read_pageInvoice">访问开票管理</el-checkbox>
        </td></tr>
        <tr><td>
          <el-button type="primary" plain size="mini" class="btnPage">收款管理</el-button>
          <el-checkbox v-model="check.read_receipt">访问收款管理</el-checkbox>
          <el-checkbox v-model="check.create_receipt">增加收款</el-checkbox>
          <el-checkbox v-model="check.create_receipted">录入已收款金额</el-checkbox>
          <el-checkbox v-model="check.update_receipted">修改记录</el-checkbox>
        </td></tr>
        <tr><td>
          <el-button type="primary" plain size="mini" class="btnPage">客户关系</el-button>
          <el-checkbox v-model="check.read_customer">访问客户关系</el-checkbox>
          <el-checkbox v-model="check.create_customer">新增客户</el-checkbox>
          <el-checkbox v-model="check.update_customer">修改客户</el-checkbox>
          <el-checkbox v-model="check.delete_customer">删除客户</el-checkbox>
        </td></tr>
        <tr><td>
          <el-button type="primary" plain size="mini" class="btnPage">项目回收</el-button>
          <el-checkbox v-model="check.read_projectRecover">访问项目回收</el-checkbox>
          <el-checkbox v-model="check.update_projectRecover">回收项目</el-checkbox>
        </td></tr>
        <tr><td>
          <el-button type="primary" plain size="mini" class="btnPage">结算记录</el-button>
          <el-checkbox v-model="check.read_laoWuHistory">访问结算记录</el-checkbox>
        </td></tr>
        </tbody>
      </table>
      <!--版块五:生产管理-富华电力-->
      <table class="_table" border="0" cellpadding="0" cellspacing="0" style="width: 100%">
        <thead><tr><th>板块五 生产管理 - 富华电力</th></tr></thead>
        <tbody>
        <tr><td>
          <el-button type="primary" plain size="mini" class="btnPage">任务分配</el-button>
          <el-checkbox v-model="check.read_taskAllot_FH">访问任务分配</el-checkbox>
          <el-checkbox v-model="check.update_projectAssign_FH">修改分配</el-checkbox>
        </td></tr>
        <tr><td>
          <el-button type="primary" plain size="mini" class="btnPage">项目进度</el-button>
          <el-checkbox v-model="check.read_evolve_FH">访问项目进度</el-checkbox>
          <el-checkbox v-model="check.read_projectHistory_FH">查看记录</el-checkbox>
        </td></tr>
        <tr><td>
          <el-button type="primary" plain size="mini" class="btnPage">结算中心</el-button>
          <el-checkbox v-model="check.read_laoWu_FH">访问结算中心</el-checkbox>
          <el-checkbox v-model="check.create_laoWu_FH">添加项目结算条目</el-checkbox>
          <el-checkbox v-model="check.update_fen_status_FH">更新项目结算状态</el-checkbox>
          <el-checkbox v-model="check.read_laoWuTotal_FH">查看所有结算记录</el-checkbox>
          <el-checkbox v-model="check.read_laoWuTeam_FH">查看工人结算记录</el-checkbox>
          <el-checkbox v-model="check.update_laoWuTeam_FH">修改工人结算记录</el-checkbox>
          <el-checkbox v-model="check.create_laoWuTeam_FH">添加工人结算记录</el-checkbox>
          <el-checkbox v-model="check.update_fen_type_FH">修改项目分包属性</el-checkbox>
        </td></tr>
        </tbody>
      </table>
      <!--版块六:生产管理-华建电力-->
      <table class="_table" border="0" cellpadding="0" cellspacing="0" style="width: 100%">
        <thead><tr><th>版块六 生产管理 - 华建电力</th></tr></thead>
        <tbody>
        <tr><td>
          <el-button type="primary" plain size="mini" class="btnPage">任务分配</el-button>
          <el-checkbox v-model="check.read_taskAllot_HJ">访问任务分配</el-checkbox>
          <el-checkbox v-model="check.read_projectHistory_HJ">查看生产记录</el-checkbox>
          <el-checkbox v-model="check.update_projectAssign_HJ">修改项目分配</el-checkbox>
          <el-checkbox v-model="check.read_sonProject_HJ">查看子项目</el-checkbox>
          <el-checkbox v-model="check.read_sonProjectHistory_HJ">查看子项目生产记录</el-checkbox>
          <el-checkbox v-model="check.update_sonProjectAssign_HJ">修改子项目分配</el-checkbox>
        </td></tr>
        <tr><td>
          <el-button type="primary" plain size="mini" class="btnPage">项目统计</el-button>
          <el-checkbox v-model="check.read_productTotal_HJ">访问项目统计</el-checkbox>
        </td></tr>
        <tr><td>
          <el-button type="primary" plain size="mini" class="btnPage">工程造价</el-button>
          <el-checkbox v-model="check.read_evolve_HJ">访问工程造价</el-checkbox>
          <el-checkbox v-model="check.update_evolve_HJ">修改</el-checkbox>
          <el-checkbox v-model="check.read_evolveSon_HJ">显示子项目</el-checkbox>
          <el-checkbox v-model="check.create_evolveSon_HJ">添加子项目</el-checkbox>
        </td></tr>
        <tr><td>
          <el-button type="primary" plain size="mini" class="btnPage">项目报表</el-button>
          <el-checkbox v-model="check.read_report_HJ">访问项目报表</el-checkbox>
          <el-checkbox v-model="check.create_report_HJ">新增部门产值</el-checkbox>
        </td></tr>
        </tbody>
      </table>
      <!--版块七:生产管理-源通电力-->
      <table class="_table" border="0" cellpadding="0" cellspacing="0" style="width: 100%">
        <thead><tr><th>版块七 生产管理 - 源通电力</th></tr></thead>
        <tbody>
        <tr><td>
          <el-button type="primary" plain size="mini" class="btnPage">任务分配</el-button>
          <el-checkbox v-model="check.read_taskAllot_YT">访问任务分配</el-checkbox>
          <el-checkbox v-model="check.update_projectAssign_YT">修改分配</el-checkbox>
        </td></tr>
        <tr><td>
          <el-button type="primary" plain size="mini" class="btnPage">工程进度</el-button>
          <el-checkbox v-model="check.read_evolve_YT">访问工程进度</el-checkbox>
          <el-checkbox v-model="check.read_projectHistory_YT">查看进度</el-checkbox>
        </td></tr>
        <tr><td>
          <el-button type="primary" plain size="mini" class="btnPage">结算中心</el-button>
          <el-checkbox v-model="check.read_laoWu_YT">访问结算中心</el-checkbox>
          <el-checkbox v-model="check.create_laoWu_YT">添加项目结算条目</el-checkbox>
          <el-checkbox v-model="check.update_fen_status_YT">更新项目结算状态</el-checkbox>
          <el-checkbox v-model="check.read_laoWuTotal_YT">查看所有结算记录</el-checkbox>
          <el-checkbox v-model="check.read_laoWuTeam_YT">查看工人结算记录</el-checkbox>
          <el-checkbox v-model="check.update_laoWuTeam_YT">修改工人结算记录</el-checkbox>
          <el-checkbox v-model="check.create_laoWuTeam_YT">添加工人结算记录</el-checkbox>
          <el-checkbox v-model="check.update_fen_type_YT">修改项目分包属性</el-checkbox>
        </td></tr>
        <tr><td>
          <el-button type="primary" plain size="mini" class="btnPage">物资采购</el-button>
          <el-checkbox v-model="check.read_goodsCost_YT">访问物资采购</el-checkbox>
          <el-checkbox v-model="check.create_costGoods_YT">添加物资采购记录</el-checkbox>
          <el-checkbox v-model="check.update_costGoods_YT">修改物资采购记录</el-checkbox>
        </td></tr>
        </tbody>
      </table>
    </div>

    <!--添加分组表单-->
    <el-dialog title="创建权限组" :visible.sync="ruleFormVisible">
      <el-form :rules="rules" :model="ruleForm" ref="ruleForm" label-width="180px" size="mini">
        <el-form-item label="设置权限组名称" prop="name" >
          <el-input style="width: 300px" v-model="ruleForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="填写权限组的组权限描述" prop="describe">
          <el-input
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            style="width: 400px"
            v-model="ruleForm.describe"
            auto-complete="off">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        <el-button @click="ruleFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<!--
    Permissions on this page:
    页面访问: read_contract   beforeMount()
    修改组权限: update_accessGroup onUpdateAccess()
    创建权限组: create_accessGroup onCreateGroup()

    权限系统 - 增加一个权限的9个步骤:
    1 首先需要在页面访问或功能点击时进行权限字段检查
    2 需要在路由对应页面的hidden属性增加权限字段
    3 页面访问的权限需要在permission中的accessCheck方法增加一条权限检索
    4 页面访问的权限需要在permission中的dgDelete方法中增加一条权限检索
    5 页面访问的权限需要在permission中的permission常量中的routerHidden对象中增加一个权限字段
    6 需要在accessGroup页面增加一个权限选择框
    7 需要在accessGroup页面的accessCheckDefault常量中增加一个权限字段
    8 需要在accessGroup页面pakCheck方法中增加一条权限检索
    9 需要在accessGroup页面analysisAccess方法中增加一条权限检索
-->
<script>
  const accessCheckDefault = {
    read_costAccounts: false,
    update_costAccounts: false,
    read_profitAccounts: false,
    update_profitAccounts: false,
    read_outputAccounts: false,
    update_outputAccounts: false,
    read_pageDepartmentAccounts: false,
    create_departmentAccounts: false,
    read_groupCost: false,
    create_group: false,
    update_group: false,
    read_generalCost: false,
    create_general: false,
    create_general_Excel: false,
    update_general: false,
    read_generalCost_UseAndNote: false,
    read_basicCost: false,
    create_costBasic: false,
    create_costBasic_Excel: false,
    update_costBasic: false,
    read_basicCost_UseAndNote: false,
    read_goodsCost: false,
    create_costGoods: false,
    create_costGoods_Excel: false,
    update_costGoods: false,
    read_goodsCost_UseAndNote: false,
    read_sbjType: false,
    create_costSubject: false,
    update_costSubject: false,
    read_carManage: false,
    read_accessStuffs: false,
    update_accessStuffGroup: false,
    read_accessGroup: false,
    update_accessGroup: false,
    create_accessGroup: false,
    read_department: false,
    create_department: false,
    update_department_leader: false,
    read_user: false,
    create_user: false,
    update_user: false,
    read_project: false,
    create_project: false,
    update_project: false,
    delete_project: false,
    read_contract: false,
    update_signStatus: false,
    update_contractStatus: false,
    read_receipt: false,
    create_receipt: false,
    create_receipted: false,
    update_receipted: false,
    read_customer: false,
    create_customer: false,
    update_customer: false,
    delete_customer: false,
    read_projectRecover: false,
    update_projectRecover: false,
    read_laoWuHistory: false,
    read_taskAllot_FH: false,
    update_projectAssign_FH: false,
    read_evolve_FH: false,
    read_projectHistory_FH: false,
    read_laoWu_FH: false,
    create_laoWu_FH: false,
    update_fen_status_FH: false,
    read_laoWuTotal_FH: false,
    read_laoWuTeam_FH: false,
    update_laoWuTeam_FH: false,
    create_laoWuTeam_FH: false,
    update_fen_type_FH: false,
    read_taskAllot_HJ: false,
    read_projectHistory_HJ: false,
    update_projectAssign_HJ: false,
    read_sonProject_HJ: false,
    read_sonProjectHistory_HJ: false,
    update_sonProjectAssign_HJ: false,
    read_productTotal_HJ: false,
    read_evolve_HJ: false,
    update_evolve_HJ: false,
    read_evolveSon_HJ: false,
    create_evolveSon_HJ: false,
    read_report_HJ: false,
    create_report_HJ: false,
    read_taskAllot_YT: false,
    update_projectAssign_YT: false,
    read_evolve_YT: false,
    read_projectHistory_YT: false,
    read_laoWu_YT: false,
    create_laoWu_YT: false,
    update_fen_status_YT: false,
    read_laoWuTotal_YT: false,
    read_laoWuTeam_YT: false,
    update_laoWuTeam_YT: false,
    create_laoWuTeam_YT: false,
    update_fen_type_YT: false,
    read_goodsCost_YT: false,
    create_costGoods_YT: false,
    update_costGoods_YT: false,
    create_costApply_Excel: false,
    read_applyManage_pageApplyAll: false,
    read_applyManage_All: false,
    read_applyManage_Failed: false,
    read_pageApprovalProcess: false,
    update_approvalJT: false,
    update_approvalHJ: false,
    update_approvalFH: false,
    update_approvalYT: false,
    update_approvalWL: false,
    read_Financial_pageApplyAll: false,
    read_Financial_pageProofCreate: false,
    read_pageInvoice: false,
    read_pageInvoiceApply: false,
    read_pageReceiptConfirmation: false,
    read_pageBankFlow: false,
    read_pageReceivable: false,
    read_pageSummary: false
  }
  import { getAccessGroup, createAccessGroup, updateAccessGroup } from '../../../api/access'

  export default {
    name: 'accessGroup',
    data() {
      return {
        // 所有权限组
        groups: [],
        // 搜索表单对象
        searchForm: {
          id: null,
          name: '',
          describe: '',
          access: ''
        },
        // 某权限组所有权限字段集合
        access: '',
        // 添加权限组表单对象
        ruleForm: {
          name: null,
          describe: null,
          access: null
        },
        ruleFormVisible: false,
        rules: {
          name: [
            { required: true, message: '权限组名称不得为空', trigger: 'blur' }
          ]
        },
        // 权限选择框
        check: Object.assign({}, accessCheckDefault)
      }
    },
    methods: {
      /** 创建权限组被点击事件 */
      onCreateGroup() {
        /** 权限检查 */
        if (this.actionCheck_.actionCheck('create_accessGroup#') === false) {
          this.$message.error('错误提示,您没有该操作的权限!')
          return false
        }
        this.ruleFormVisible = true
      },
      /** 确认修改被点击事件 */
      onUpdateAccess() {
        /** 权限检查 */
        if (this.actionCheck_.actionCheck('update_accessGroup#') === false) {
          this.$message.error('错误提示,您没有该操作的权限!')
          return false
        }
        this.pakCheck()
        this.updateAccess(this.ruleForm)
      },
      /** 合并权限 */
      pakCheck() {
        let pakAccess = ''
        //
        if (this.check.read_costAccounts === true) pakAccess += 'read_costAccounts#'
        if (this.check.update_costAccounts === true) pakAccess += 'update_costAccounts#'
        if (this.check.read_profitAccounts === true) pakAccess += 'read_profitAccounts#'
        if (this.check.update_profitAccounts === true) pakAccess += 'update_profitAccounts#'
        if (this.check.read_outputAccounts === true) pakAccess += 'read_outputAccounts#'
        if (this.check.update_outputAccounts === true) pakAccess += 'update_outputAccounts#'
        if (this.check.read_pageDepartmentAccounts === true) pakAccess += 'read_pageDepartmentAccounts#'
        if (this.check.create_departmentAccounts === true) pakAccess += 'create_departmentAccounts#'
        //
        if (this.check.create_costApply_Excel === true) pakAccess += 'create_costApply_Excel#'
        if (this.check.read_applyManage_pageApplyAll === true) pakAccess += 'read_applyManage_pageApplyAll#'
        if (this.check.read_applyManage_All === true) pakAccess += 'read_applyManage_All#'
        if (this.check.read_applyManage_Failed === true) pakAccess += 'read_applyManage_Failed#'
        if (this.check.read_pageApprovalProcess === true) pakAccess += 'read_pageApprovalProcess#'
        if (this.check.update_approvalJT === true) pakAccess += 'update_approvalJT#'
        if (this.check.update_approvalHJ === true) pakAccess += 'update_approvalHJ#'
        if (this.check.update_approvalFH === true) pakAccess += 'update_approvalFH#'
        if (this.check.update_approvalYT === true) pakAccess += 'update_approvalYT#'
        if (this.check.update_approvalWL === true) pakAccess += 'update_approvalWL#'
        //
        if (this.check.read_Financial_pageApplyAll === true) pakAccess += 'read_Financial_pageApplyAll#'
        if (this.check.read_Financial_pageProofCreate === true) pakAccess += 'read_Financial_pageProofCreate#'
        if (this.check.read_pageInvoiceApply === true) pakAccess += 'read_pageInvoiceApply#'
        if (this.check.read_pageReceiptConfirmation === true) pakAccess += 'read_pageReceiptConfirmation#'
        if (this.check.read_pageBankFlow === true) pakAccess += 'read_pageBankFlow#'
        if (this.check.read_pageReceivable === true) pakAccess += 'read_pageReceivable#'
        if (this.check.read_pageSummary === true) pakAccess += 'read_pageSummary#'
        //
        if (this.check.read_groupCost === true) pakAccess += 'read_groupCost#'
        if (this.check.create_group === true) pakAccess += 'create_group#'
        if (this.check.update_group === true) pakAccess += 'update_group#'
        //
        if (this.check.read_generalCost === true) pakAccess += 'read_generalCost#'
        if (this.check.create_general === true) pakAccess += 'create_general#'
        if (this.check.create_general_Excel === true) pakAccess += 'create_general_Excel#'
        if (this.check.update_general === true) pakAccess += 'update_general#'
        if (this.check.read_generalCost_UseAndNote === true) pakAccess += 'read_generalCost_UseAndNote#'
        //
        if (this.check.read_basicCost === true) pakAccess += 'read_basicCost#'
        if (this.check.create_costBasic === true) pakAccess += 'create_costBasic#'
        if (this.check.create_costBasic_Excel === true) pakAccess += 'create_costBasic_Excel#'
        if (this.check.update_costBasic === true) pakAccess += 'update_costBasic#'
        if (this.check.read_basicCost_UseAndNote === true) pakAccess += 'read_basicCost_UseAndNote#'
        //
        if (this.check.read_goodsCost === true) pakAccess += 'read_goodsCost#'
        if (this.check.create_costGoods === true) pakAccess += 'create_costGoods#'
        if (this.check.create_costGoods_Excel === true) pakAccess += 'create_costGoods_Excel#'
        if (this.check.update_costGoods === true) pakAccess += 'update_costGoods#'
        if (this.check.read_goodsCost_UseAndNote === true) pakAccess += 'read_goodsCost_UseAndNote#'
        //
        if (this.check.read_sbjType === true) pakAccess += 'read_sbjType#'
        if (this.check.create_costSubject === true) pakAccess += 'create_costSubject#'
        if (this.check.update_costSubject === true) pakAccess += 'update_costSubject#'
        //
        if (this.check.read_carManage === true) pakAccess += 'read_carManage#'
        if (this.check.read_accessStuffs === true) pakAccess += 'read_accessStuffs#'
        if (this.check.update_accessStuffGroup === true) pakAccess += 'update_accessStuffGroup#'
        if (this.check.read_accessGroup === true) pakAccess += 'read_accessGroup#'
        if (this.check.update_accessGroup === true) pakAccess += 'update_accessGroup#'
        if (this.check.create_accessGroup === true) pakAccess += 'create_accessGroup#'
        //
        if (this.check.read_department === true) pakAccess += 'read_department#'
        if (this.check.create_department === true) pakAccess += 'create_department#'
        if (this.check.update_department_leader === true) pakAccess += 'update_department_leader#'
        //
        if (this.check.read_user === true) pakAccess += 'read_user#'
        if (this.check.create_user === true) pakAccess += 'create_user#'
        if (this.check.update_user === true) pakAccess += 'update_user#'
        //
        if (this.check.read_project === true) pakAccess += 'read_project#'
        if (this.check.create_project === true) pakAccess += 'create_project#'
        if (this.check.update_project === true) pakAccess += 'update_project#'
        if (this.check.delete_project === true) pakAccess += 'delete_project#'
        //
        if (this.check.read_pageInvoice === true) pakAccess += 'read_pageInvoice#'
        //
        if (this.check.read_contract === true) pakAccess += 'read_contract#'
        if (this.check.update_signStatus === true) pakAccess += 'update_signStatus#'
        if (this.check.update_contractStatus === true) pakAccess += 'update_contractStatus#'
        //
        if (this.check.read_receipt === true) pakAccess += 'read_receipt#'
        if (this.check.create_receipt === true) pakAccess += 'create_receipt#'
        if (this.check.create_receipted === true) pakAccess += 'create_receipted#'
        if (this.check.update_receipted === true) pakAccess += 'update_receipted#'
        //
        if (this.check.read_customer === true) pakAccess += 'read_customer#'
        if (this.check.create_customer === true) pakAccess += 'create_customer#'
        if (this.check.update_customer === true) pakAccess += 'update_customer#'
        if (this.check.delete_customer === true) pakAccess += 'delete_customer#'
        //
        if (this.check.read_projectRecover === true) pakAccess += 'read_projectRecover#'
        if (this.check.update_projectRecover === true) pakAccess += 'update_projectRecover#'
        //
        if (this.check.read_laoWuHistory === true) pakAccess += 'read_laoWuHistory#'
        //
        if (this.check.read_taskAllot_FH === true) pakAccess += 'read_taskAllot_FH#'
        if (this.check.update_projectAssign_FH === true) pakAccess += 'update_projectAssign_FH#'
        if (this.check.read_evolve_FH === true) pakAccess += 'read_evolve_FH#'
        if (this.check.read_projectHistory_FH === true) pakAccess += 'read_projectHistory_FH#'
        if (this.check.read_laoWu_FH === true) pakAccess += 'read_laoWu_FH#'
        if (this.check.create_laoWu_FH === true) pakAccess += 'create_laoWu_FH#'
        if (this.check.update_fen_status_FH === true) pakAccess += 'update_fen_status_FH#'
        if (this.check.read_laoWuTotal_FH === true) pakAccess += 'read_laoWuTotal_FH#'
        if (this.check.read_laoWuTeam_FH === true) pakAccess += 'read_laoWuTeam_FH#'
        if (this.check.update_laoWuTeam_FH === true) pakAccess += 'update_laoWuTeam_FH#'
        if (this.check.create_laoWuTeam_FH === true) pakAccess += 'create_laoWuTeam_FH#'
        if (this.check.update_fen_type_FH === true) pakAccess += 'update_fen_type_FH#'
        //
        if (this.check.read_taskAllot_HJ === true) pakAccess += 'read_taskAllot_HJ#'
        if (this.check.read_projectHistory_HJ === true) pakAccess += 'read_projectHistory_HJ#'
        if (this.check.update_projectAssign_HJ === true) pakAccess += 'update_projectAssign_HJ#'
        if (this.check.read_sonProject_HJ === true) pakAccess += 'read_sonProject_HJ#'
        if (this.check.read_sonProjectHistory_HJ === true) pakAccess += 'read_sonProjectHistory_HJ#'
        if (this.check.update_sonProjectAssign_HJ === true) pakAccess += 'update_sonProjectAssign_HJ#'
        if (this.check.read_productTotal_HJ === true) pakAccess += 'read_productTotal_HJ#'
        if (this.check.read_evolve_HJ === true) pakAccess += 'read_evolve_HJ#'
        if (this.check.update_evolve_HJ === true) pakAccess += 'update_evolve_HJ#'
        if (this.check.read_evolveSon_HJ === true) pakAccess += 'read_evolveSon_HJ#'
        if (this.check.create_evolveSon_HJ === true) pakAccess += 'create_evolveSon_HJ#'
        if (this.check.read_report_HJ === true) pakAccess += 'read_report_HJ#'
        if (this.check.create_report_HJ === true) pakAccess += 'create_report_HJ#'
        //
        if (this.check.read_taskAllot_YT === true) pakAccess += 'read_taskAllot_YT#'
        if (this.check.update_projectAssign_YT === true) pakAccess += 'update_projectAssign_YT#'
        if (this.check.read_evolve_YT === true) pakAccess += 'read_evolve_YT#'
        if (this.check.read_projectHistory_YT === true) pakAccess += 'read_projectHistory_YT#'
        if (this.check.read_laoWu_YT === true) pakAccess += 'read_laoWu_YT#'
        if (this.check.create_laoWu_YT === true) pakAccess += 'create_laoWu_YT#'
        if (this.check.update_fen_status_YT === true) pakAccess += 'update_fen_status_YT#'
        if (this.check.read_laoWuTotal_YT === true) pakAccess += 'read_laoWuTotal_YT#'
        if (this.check.read_laoWuTeam_YT === true) pakAccess += 'read_laoWuTeam_YT#'
        if (this.check.update_laoWuTeam_YT === true) pakAccess += 'update_laoWuTeam_YT#'
        if (this.check.create_laoWuTeam_YT === true) pakAccess += 'create_laoWuTeam_YT#'
        if (this.check.update_fen_type_YT === true) pakAccess += 'update_fen_type_YT#'
        if (this.check.read_goodsCost_YT === true) pakAccess += 'read_goodsCost_YT#'
        if (this.check.create_costGoods_YT === true) pakAccess += 'create_costGoods_YT#'
        if (this.check.update_costGoods_YT === true) pakAccess += 'update_costGoods_YT#'
        //
        this.ruleForm.access = pakAccess
      },
      /** 选择框被选择事件 */
      remoteGroup() {
        getAccessGroup({ 'id': this.searchForm.id }).then(res => {
          this.searchForm.name = res.data._items[0].name
          this.searchForm.describe = res.data._items[0].describe
          this.searchForm.access = res.data._items[0].access
          this.access = res.data._items[0].access
          setTimeout(this.analysisAccess(), 3000)
          this.$notify({
            title: '读取权限完毕',
            type: 'success',
            position: 'top-left'
          })
        })
      },
      /** 接口类 获取权限组*/
      fetchAccessGroups(params) {
        getAccessGroup(params).then(res => {
          this.groups = res.data._items
        })
      },
      /** 解析权限字段 */
      analysisAccess(items) {
        this.check = Object.assign({}, accessCheckDefault)
        //
        this.check.read_costAccounts = this.accessHave(this.access, 'read_costAccounts#') === true
        this.check.update_costAccounts = this.accessHave(this.access, 'update_costAccounts#') === true
        this.check.read_profitAccounts = this.accessHave(this.access, 'read_profitAccounts#') === true
        this.check.update_profitAccounts = this.accessHave(this.access, 'update_profitAccounts#') === true
        this.check.read_outputAccounts = this.accessHave(this.access, 'read_outputAccounts#') === true
        this.check.update_outputAccounts = this.accessHave(this.access, 'update_outputAccounts#') === true
        this.check.read_pageDepartmentAccounts = this.accessHave(this.access, 'read_pageDepartmentAccounts#') === true
        this.check.create_departmentAccounts = this.accessHave(this.access, 'create_departmentAccounts#') === true
        //
        this.check.create_costApply_Excel = this.accessHave(this.access, 'create_costApply_Excel#') === true
        this.check.read_applyManage_pageApplyAll = this.accessHave(this.access, 'read_applyManage_pageApplyAll#') === true
        this.check.read_applyManage_All = this.accessHave(this.access, 'read_applyManage_All#') === true
        this.check.read_applyManage_Failed = this.accessHave(this.access, 'read_applyManage_Failed#') === true
        this.check.read_pageApprovalProcess = this.accessHave(this.access, 'read_pageApprovalProcess#') === true
        this.check.update_approvalJT = this.accessHave(this.access, 'update_approvalJT#') === true
        this.check.update_approvalHJ = this.accessHave(this.access, 'update_approvalHJ#') === true
        this.check.update_approvalFH = this.accessHave(this.access, 'update_approvalFH#') === true
        this.check.update_approvalYT = this.accessHave(this.access, 'update_approvalYT#') === true
        this.check.update_approvalWL = this.accessHave(this.access, 'update_approvalWL#') === true
        //
        this.check.read_Financial_pageApplyAll = this.accessHave(this.access, 'read_Financial_pageApplyAll#') === true
        this.check.read_Financial_pageProofCreate = this.accessHave(this.access, 'read_Financial_pageProofCreate#') === true
        this.check.read_pageInvoiceApply = this.accessHave(this.access, 'read_pageInvoiceApply#') === true
        this.check.read_pageReceiptConfirmation = this.accessHave(this.access, 'read_pageReceiptConfirmation#') === true
        this.check.read_pageBankFlow = this.accessHave(this.access, 'read_pageBankFlow#') === true
        this.check.read_pageReceivable = this.accessHave(this.access, 'read_pageReceivable#') === true
        this.check.read_pageSummary = this.accessHave(this.access, 'read_pageSummary#') === true
        //
        this.check.read_groupCost = this.accessHave(this.access, 'read_groupCost#') === true
        this.check.create_group = this.accessHave(this.access, 'create_group#') === true
        this.check.update_group = this.accessHave(this.access, 'update_group#') === true
        //
        this.check.read_generalCost = this.accessHave(this.access, 'read_generalCost#') === true
        this.check.create_general = this.accessHave(this.access, 'create_general#') === true
        this.check.create_general_Excel = this.accessHave(this.access, 'create_general_Excel#') === true
        this.check.update_general = this.accessHave(this.access, 'update_general#') === true
        this.check.read_generalCost_UseAndNote = this.accessHave(this.access, 'read_generalCost_UseAndNote#') === true
        //
        this.check.read_basicCost = this.accessHave(this.access, 'read_basicCost#') === true
        this.check.create_costBasic = this.accessHave(this.access, 'create_costBasic#') === true
        this.check.create_costBasic_Excel = this.accessHave(this.access, 'create_costBasic_Excel#') === true
        this.check.update_costBasic = this.accessHave(this.access, 'update_costBasic#') === true
        this.check.read_basicCost_UseAndNote = this.accessHave(this.access, 'read_basicCost_UseAndNote#') === true
        //
        this.check.read_goodsCost = this.accessHave(this.access, 'read_goodsCost#') === true
        this.check.create_costGoods = this.accessHave(this.access, 'create_costGoods#') === true
        this.check.create_costGoods_Excel = this.accessHave(this.access, 'create_costGoods_Excel#') === true
        this.check.update_costGoods = this.accessHave(this.access, 'update_costGoods#') === true
        this.check.read_goodsCost_UseAndNote = this.accessHave(this.access, 'read_goodsCost_UseAndNote#') === true
        //
        this.check.read_sbjType = this.accessHave(this.access, 'read_sbjType#') === true
        this.check.create_costSubject = this.accessHave(this.access, 'create_costSubject#') === true
        this.check.update_costSubject = this.accessHave(this.access, 'update_costSubject#') === true
        //
        this.check.read_carManage = this.accessHave(this.access, 'read_carManage#') === true
        //
        this.check.read_accessStuffs = this.accessHave(this.access, 'read_accessStuffs#') === true
        this.check.update_accessStuffGroup = this.accessHave(this.access, 'update_accessStuffGroup#') === true
        this.check.read_accessGroup = this.accessHave(this.access, 'read_accessGroup#') === true
        this.check.update_accessGroup = this.accessHave(this.access, 'update_accessGroup#') === true
        this.check.create_accessGroup = this.accessHave(this.access, 'create_accessGroup#') === true
        //
        this.check.read_department = this.accessHave(this.access, 'read_department#') === true
        this.check.create_department = this.accessHave(this.access, 'create_department#') === true
        this.check.update_department_leader = this.accessHave(this.access, 'update_department_leader#') === true
        //
        this.check.read_user = this.accessHave(this.access, 'read_user#') === true
        this.check.create_user = this.accessHave(this.access, 'create_user#') === true
        this.check.update_user = this.accessHave(this.access, 'update_user#') === true
        //
        this.check.read_project = this.accessHave(this.access, 'read_project#') === true
        this.check.create_project = this.accessHave(this.access, 'create_project#') === true
        this.check.update_project = this.accessHave(this.access, 'update_project#') === true
        this.check.delete_project = this.accessHave(this.access, 'delete_project#') === true
        //
        this.check.read_pageInvoice = this.accessHave(this.access, 'read_pageInvoice#') === true
        //
        this.check.read_contract = this.accessHave(this.access, 'read_contract#') === true
        this.check.update_signStatus = this.accessHave(this.access, 'update_signStatus#') === true
        this.check.update_contractStatus = this.accessHave(this.access, 'update_contractStatus#') === true
        //
        this.check.read_receipt = this.accessHave(this.access, 'read_receipt#') === true
        this.check.create_receipt = this.accessHave(this.access, 'create_receipt#') === true
        this.check.create_receipted = this.accessHave(this.access, 'create_receipted#') === true
        this.check.update_receipted = this.accessHave(this.access, 'update_receipted#') === true
        //
        this.check.read_customer = this.accessHave(this.access, 'read_customer#') === true
        this.check.create_customer = this.accessHave(this.access, 'create_customer#') === true
        this.check.update_customer = this.accessHave(this.access, 'update_customer#') === true
        this.check.delete_customer = this.accessHave(this.access, 'delete_customer#') === true
        //
        this.check.read_projectRecover = this.accessHave(this.access, 'read_projectRecover#') === true
        this.check.update_projectRecover = this.accessHave(this.access, 'update_projectRecover#') === true
        //
        this.check.read_laoWuHistory = this.accessHave(this.access, 'read_laoWuHistory#') === true
        //
        this.check.read_taskAllot_FH = this.accessHave(this.access, 'read_taskAllot_FH#') === true
        this.check.update_projectAssign_FH = this.accessHave(this.access, 'update_projectAssign_FH#') === true
        this.check.read_evolve_FH = this.accessHave(this.access, 'read_evolve_FH#') === true
        this.check.read_projectHistory_FH = this.accessHave(this.access, 'read_projectHistory_FH#') === true
        this.check.read_laoWu_FH = this.accessHave(this.access, 'read_laoWu_FH#') === true
        this.check.create_laoWu_FH = this.accessHave(this.access, 'create_laoWu_FH#') === true
        this.check.update_fen_status_FH = this.accessHave(this.access, 'update_fen_status_FH#') === true
        this.check.read_laoWuTotal_FH = this.accessHave(this.access, 'read_laoWuTotal_FH#') === true
        this.check.read_laoWuTeam_FH = this.accessHave(this.access, 'read_laoWuTeam_FH#') === true
        this.check.update_laoWuTeam_FH = this.accessHave(this.access, 'update_laoWuTeam_FH#') === true
        this.check.create_laoWuTeam_FH = this.accessHave(this.access, 'create_laoWuTeam_FH#') === true
        this.check.update_fen_type_FH = this.accessHave(this.access, 'update_fen_type_FH#') === true
        //
        this.check.read_taskAllot_HJ = this.accessHave(this.access, 'read_taskAllot_HJ#') === true
        this.check.read_projectHistory_HJ = this.accessHave(this.access, 'read_projectHistory_HJ#') === true
        this.check.update_projectAssign_HJ = this.accessHave(this.access, 'update_projectAssign_HJ#') === true
        this.check.read_sonProject_HJ = this.accessHave(this.access, 'read_sonProject_HJ#') === true
        this.check.read_sonProjectHistory_HJ = this.accessHave(this.access, 'read_sonProjectHistory_HJ#') === true
        this.check.update_sonProjectAssign_HJ = this.accessHave(this.access, 'update_sonProjectAssign_HJ#') === true
        this.check.read_productTotal_HJ = this.accessHave(this.access, 'read_productTotal_HJ#') === true
        this.check.read_evolve_HJ = this.accessHave(this.access, 'read_evolve_HJ#') === true
        this.check.update_evolve_HJ = this.accessHave(this.access, 'update_evolve_HJ#') === true
        this.check.read_evolveSon_HJ = this.accessHave(this.access, 'read_evolveSon_HJ#') === true
        this.check.create_evolveSon_HJ = this.accessHave(this.access, 'create_evolveSon_HJ#') === true
        this.check.read_report_HJ = this.accessHave(this.access, 'read_report_HJ#') === true
        this.check.create_report_HJ = this.accessHave(this.access, 'create_report_HJ#') === true
        //
        this.check.read_taskAllot_YT = this.accessHave(this.access, 'read_taskAllot_YT#') === true
        this.check.update_projectAssign_YT = this.accessHave(this.access, 'update_projectAssign_YT#') === true
        this.check.read_evolve_YT = this.accessHave(this.access, 'read_evolve_YT#') === true
        this.check.read_projectHistory_YT = this.accessHave(this.access, 'read_projectHistory_YT#') === true
        this.check.read_laoWu_YT = this.accessHave(this.access, 'read_laoWu_YT#') === true
        this.check.create_laoWu_YT = this.accessHave(this.access, 'create_laoWu_YT#') === true
        this.check.update_fen_status_YT = this.accessHave(this.access, 'update_fen_status_YT#') === true
        this.check.read_laoWuTotal_YT = this.accessHave(this.access, 'read_laoWuTotal_YT#') === true
        this.check.read_laoWuTeam_YT = this.accessHave(this.access, 'read_laoWuTeam_YT#') === true
        this.check.update_laoWuTeam_YT = this.accessHave(this.access, 'update_laoWuTeam_YT#') === true
        this.check.create_laoWuTeam_YT = this.accessHave(this.access, 'create_laoWuTeam_YT#') === true
        this.check.update_fen_type_YT = this.accessHave(this.access, 'update_fen_type_YT#') === true
        this.check.read_goodsCost_YT = this.accessHave(this.access, 'read_goodsCost_YT#') === true
        this.check.create_costGoods_YT = this.accessHave(this.access, 'create_costGoods_YT#') === true
        this.check.update_costGoods_YT = this.accessHave(this.access, 'update_costGoods_YT#') === true
      },
      /** 判断权限字段是否存在 */
      accessHave(access, name) {
        if (this.isEmpty(access) === false) {
          const str = (access).toString()
          return str.indexOf(name) > -1
        } else return false
      },
      /** 提交新增分组表单 */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            createAccessGroup(this.ruleForm).then(res => {
              if (res.data.bCode === 101) {
                this.$notify({
                  title: '成功',
                  message: '新增成功',
                  type: 'success',
                  position: 'top-right'
                })
                this.fetchAccessGroups()
                this.resetForm(formName)
              } else {
                for (const key in res.data.bData) {
                  this.$notify({
                    title: '警告',
                    message: res.data.bData[key],
                    type: 'warning',
                    position: 'top-right'
                  })
                }
              }
              this.ruleFormVisible = false
            })
          } else {
            console.log('提交错误!!')
            return false
          }
        })
      },
      /** 提交新增分组权限 */
      updateAccess(formName) {
        if (this.isEmpty(this.searchForm.id) === true) {
          this.$notify({ title: '错误', message: '您还没有选择分组', type: 'warning', position: 'top-right' })
          return false
        }
        this.ruleForm.id = this.searchForm.id
        updateAccessGroup(this.ruleForm).then(res => {
          if (res.data.bCode === 101) {
            this.$notify({
              title: '成功',
              message: '权限更新成功,约束将在用户下次登录时生效',
              type: 'success',
              position: 'top-right'
            })
            this.remoteGroup()
          } else {
            for (const key in res.data.bData) {
              this.$notify({
                title: '警告',
                message: res.data.bData[key],
                type: 'warning',
                position: 'top-right'
              })
            }
          }
          this.ruleFormVisible = false
        })
      },
      // 重置表单
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      // 判断字符是否为空的方法
      isEmpty(obj) {
        return typeof obj === 'undefined' || obj == null || obj === ''
      }
    },
    mounted() {
      this.fetchAccessGroups()
    },
    // 页面权限检查 如无权限则跳转至404
    beforeMount() {
      /**  页面权限检查 如无权限则跳转至404  */
      if (this.actionCheck_.actionCheck('read_accessGroup#') === false) {
        this.$message.error('错误提示: 您没有访问该页面的权限!')
        this.$router.push({ name: '404' })
      }
    }
  }
</script>

<style scoped>
  .btnPage{
   margin-right: 30px;
    width: 150px
  }

  .header{
    margin-top: 40px;
    height: 180px;
  }

  .floatContainer{
    background-color: #466071;
    height: 51px;
    width: 88.5%;
    position: fixed;
    z-index: 100;
    right: 0;
    top: 50px;
  }

  .btnFloat{
    float: right;
    margin-right: 30px;
    margin-top: 5px;
    margin-bottom: 5px;
  }

  .tableFirst{
    margin-top: 2px;
  }

  .headerSelect{
    float: left;
    width: 310px;
    margin-top: 5px;
    margin-bottom: 5px;
    background-color: #ffffff;
    margin-left: 10px;
  }
</style>
