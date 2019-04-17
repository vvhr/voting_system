<template>
  <div class="app-container">
    <!--头部部分-->
    <div class="header">
      <div v-if="showCheckbox">
        <!--温馨提示栏-->
        <el-row>
          <el-col :span="1.5" style="margin-top: 1px;margin-bottom: 5px">
            <div class="tips">温馨提示</div>
          </el-col>
          <el-col :span="18" style="margin-top: 1px;margin-bottom: 5px">
            <div class="tips-text"><b>本页为财务部进行最终审批/校正/拨款的页面!</b>
              1. 当申请金额小于等于3000元时,审批流程只有三级! 2. 在申请到达财务审批层级时才能操作审批!
            </div>
          </el-col>
        </el-row>
        <!--搜索栏-->
        <el-row style="background-color: rgb(236, 243, 247);padding-left: 10px;padding-top: 10px;border-radius:10px 10px;">
          <el-col>
            <!--输入搜索-->
            <el-row>
              <el-form :inline="true" style="height: 40px;" ref="queryForm" :model="queryForm">
                <el-form-item label="输入搜索" prop="pro_id" label-width="70px">
                  <el-input @keyup.enter.native="onQuery" style="width: 100px;" size="small" v-model="queryForm.id" placeholder="ID"></el-input>
                </el-form-item>
                <el-form-item prop="pro_id" label-width="70px">
                  <el-select
                    @keyup.enter.native="onQuery"
                    size="small"
                    style="width: 220px"
                    v-model="queryForm.pro_id"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="项目名称"
                    :remote-method="remoteProjects">
                    <el-option
                      v-for="pro in projects"
                      :key="pro.id"
                      :label="pro.name"
                      :value="pro.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="group_id" >
                  <el-select
                    @keyup.enter.native="onQuery"
                    size="small"
                    style="width: 220px"
                    v-model="queryForm.group_id"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="分组名称"
                    :remote-method="remoteGroups">
                    <el-option
                      v-for="group in groups"
                      :key="group.id"
                      :label="group.name"
                      :value="group.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="cost_user_id" >
                  <el-select
                    @keyup.enter.native="onQuery"
                    size="small"
                    style="width: 120px"
                    v-model="queryForm.cost_user_id"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="报销人"
                    :remote-method="remoteCostUsers">
                    <el-option
                      v-for="costUser in costUsers"
                      :key="costUser.id"
                      :label="costUser.name"
                      :value="costUser.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="input_user_id" >
                  <el-select
                    @keyup.enter.native="onQuery"
                    size="small"
                    style="width: 120px"
                    v-model="queryForm.input_user_id"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="申请人"
                    :remote-method="remoteCostUsers">
                    <el-option
                      v-for="costUser in costUsers"
                      :key="costUser.id"
                      :label="costUser.name"
                      :value="costUser.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="proof_no">
                  <el-input @keyup.enter.native="onQuery" style="width: 160px;" size="small" v-model="queryForm.proof_no" placeholder="凭证编号"></el-input>
                </el-form-item>
                <el-form-item prop="receipt_no">
                  <el-input @keyup.enter.native="onQuery" style="width: 160px;" size="small" v-model="queryForm.receipt_no" placeholder="报销单号"></el-input>
                </el-form-item>
              </el-form>
            </el-row>
            <!--区间搜索-->
            <el-row>
              <el-form :inline="true" style="height: 40px;">
                <el-form-item label="区间搜索" label-width="70px">
                  <el-input @keyup.enter.native="onQuery" style="width: 100px" size="small" v-model="queryForm.start_id" placeholder="起始ID"></el-input>
                  <el-input @keyup.enter.native="onQuery" style="width: 100px" size="small" v-model="queryForm.end_id" placeholder="结束ID"></el-input>
                </el-form-item>
                <el-form-item label="申请时间" prop="date" label-width="70px">
                  <el-date-picker
                    @keyup.enter.native="onQuery"
                    size="small"
                    style="width: 320px"
                    v-model="queryForm.date"
                    type="daterange"
                    align="right"
                    unlink-panels
                    value-format = "timestamp"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions2">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="打款时间" prop="paid_at" label-width="70px">
                  <el-date-picker
                    @keyup.enter.native="onQuery"
                    size="small"
                    style="width: 320px"
                    v-model="queryForm.payer_time"
                    type="daterange"
                    align="right"
                    unlink-panels
                    value-format = "timestamp"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions2">
                  </el-date-picker>
                </el-form-item>
              </el-form>
            </el-row>
            <!--选择搜索-->
            <el-row>
              <el-form :inline="true" style="height: 40px;">
                <el-form-item label="选择搜索" prop="applyType_id">
                  <el-select @keyup.enter.native="onQuery" size="small" style="width: 160px" v-model="queryForm.applyType_id" filterable placeholder="申请类型">
                    <el-option v-for="applyType in applyTypes" :key="applyType.id" :label="applyType.name" :value="applyType.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="branch_id">
                  <el-select @keyup.enter.native="onQuery" size="small" style="width: 160px" v-model="queryForm.branch_id" filterable placeholder="分公司">
                    <el-option v-for="branch in branches" :key="branch.id" :label="branch.name" :value="branch.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="sbj_id">
                  <el-select
                    @keyup.enter.native="onQuery"
                    size="small"
                    style="width: 220px"
                    v-model="queryForm.sbj_id"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="面单科目，请按空格后选择"
                    :remote-method="remoteSubject">
                    <el-option
                      v-for="sbj in sbjs"
                      :key="sbj.id"
                      :label="sbj.name"
                      :value="parseInt(sbj.id)">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="sbjR_id">
                  <el-select
                    @keyup.enter.native="onQuery"
                    size="small"
                    style="width: 220px"
                    v-model="queryForm.sbjR_id"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="实际科目，请按空格后选择"
                    :remote-method="remoteSubject">
                    <el-option
                      v-for="sbj in sbjs"
                      :key="sbj.id"
                      :label="sbj.name"
                      :value="parseInt(sbj.id)">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </el-row>
            <!--查询 重置 按钮-->
            <el-row>
              <el-form :inline="true" style="height: 40px;margin-bottom: 10px">
                <el-form-item>
                  <el-button @click="onQuery()" size="small" style="width: 200px" icon="el-icon-search" type="primary">查询(回车)</el-button>
                  <el-button @click="onClearQuery()" size="small" style="width: 200px" icon="el-icon-search" type="primary">重置</el-button>
                </el-form-item>
              </el-form>
            </el-row>
          </el-col>
        </el-row>
      </div>
      <el-row>
        <!--表格类型切换栏-->
        <el-col style="margin-top: 10px">
          <div>
            <!--表格切换选择器-->
            <div class="header-font" >表格类型切换</div>
            <el-radio-group v-model="choseStatus" size="small" @change="onChangeChose">
              <el-radio-button label="one">查看待审批</el-radio-button>
              <el-radio-button label="two">查看已审批</el-radio-button>
              <el-radio-button label="three">查看待打款</el-radio-button>
              <el-radio-button label="four">查看已拨款</el-radio-button>
              <el-radio-button label="six">查看已异常</el-radio-button>
              <el-radio-button label="five">查看所有申请</el-radio-button>
            </el-radio-group>
            <!--<el-button :loading="downloadLoading" style="margin:0 0 20px 20px;" type="primary" icon="document" @click="handleDownload">{{ $t('excel.export') }} Excel</el-button>-->
            <!--右浮 收展按钮-->
            <el-button
              plain
              size="small"
              type="success"
              @click="showCheckbox = !showCheckbox"
              class="el-icon-d-caret shrink-button">
              {{showCheckbox === true?'收起顶部':'展开顶部'}}</el-button>
          </div>
        </el-col>
      </el-row>
      <!--选择框-->
      <el-row>
        <!--表项显示/隐藏选择栏 1 -->
        <el-col>
          <div class="header-font" >表项显示1</div>
          <el-checkbox v-model="checkBox.showProject">所属项目/分组</el-checkbox>
          <el-checkbox v-model="checkBox.showInputUser">申请人</el-checkbox>
          <el-checkbox v-model="checkBox.showApplyType">申请类型</el-checkbox>
          <el-checkbox v-model="checkBox.showCostType">报销类型</el-checkbox>
          <el-checkbox v-model="checkBox.showSbj">面单科目</el-checkbox>
          <el-checkbox v-model="checkBox.showSbjR">实际科目</el-checkbox>
          <el-checkbox v-model="checkBox.showUse">用途</el-checkbox>
        </el-col>
      </el-row>
      <el-row>
        <!--表项显示/隐藏选择栏 2 -->
        <el-col>
          <div class="header-font" >表项显示2</div>
          <el-checkbox v-model="checkBox.showReceipt_no">报销单号</el-checkbox>
          <el-checkbox v-model="checkBox.showProof" v-if="viewAccessCheck">凭证编号</el-checkbox>
          <el-checkbox v-model="checkBox.showHighLight">高亮显示</el-checkbox>
          <el-checkbox v-model="checkBox.show_cost_id">生效ID</el-checkbox>
          <el-checkbox v-model="checkBox.showApproved">审批状态</el-checkbox>
          <el-checkbox v-model="checkBox.showReason">审批备注</el-checkbox>
          <el-checkbox v-model="checkBox.showAction1">审批操作</el-checkbox>
          <el-checkbox v-model="checkBox.showPassTime">审批时间</el-checkbox>
          <el-checkbox v-model="checkBox.showPayerTime">打款时间</el-checkbox>
          <el-button @click="onRemember" type="primary" size="mini" style="margin-left: 15px;">记住我的选项</el-button>
        </el-col>
      </el-row>
      <!--批量操作栏-->
      <el-row style="background-color: rgb(107, 112, 115);border-radius:5px 5px;padding-left: 5px ">
        <!--批量操作按钮 批量统计金额-->
        <el-col :span="10">
          <div class="header-batch">批量操作：</div>
          <el-button-group>
            <el-button @click="onBatchPass" size="small" type="success" icon="el-icon-success" v-if="num >= 1">批量通过</el-button>
            <el-button @click="onBatchRefuse" size="small" type="danger" icon="el-icon-error" v-if="num >= 1">批量拒绝</el-button>
          </el-button-group>
          <div class="header-batch" style="margin-left: 20px">已选中数：{{this.num}}</div>
          <div class="header-batch" style="margin-left: 40px">金额合计：{{this.sum}}</div>
        </el-col>
        <!--分页器-->
        <el-col :span="7">
          <div class="pagination">
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageInfo.currentPage"
              :page-sizes="[10, 20, 50, 100, 200, 500, 1000]"
              :page-size="pageInfo.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pageInfo.totalCount">
            </el-pagination>
          </div>
        </el-col>
      </el-row>
    </div>
    <!--表格部分-->
    <div class="my-table-applyAll">
      <el-table
        v-loading="loading" border fit
        :data="applications" id="apply-mineCost"
        :row-style="rowStyle" :cell-style="cellStyle"
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange">
        <el-table-column align="center" type="selection" width="45"></el-table-column>
        <el-table-column fixed="left" type="expand" label="展开" width="50">
          <template slot-scope="props">
            <el-row :gutter="20" class="apply-detail">
              <el-col :span="3">
                <el-form label-position="left" style="height: 20px;">
                  <el-form-item label="一级审批人" style="height: 20px">{{ props.row.first.name }}</el-form-item>
                  <el-form-item label="二级审批人" style="height: 20px">{{ props.row.second.name }}</el-form-item>
                  <el-form-item label="三级审批人" style="height: 20px">{{ props.row.third.name }}</el-form-item>
                  <el-form-item label="四级审批人" style="height: 20px" v-if="props.row.money > 3000" >{{ props.row.fourth.name}}</el-form-item>
                  <el-form-item label="财务审批人" style="height: 20px" >{{ props.row.financial.name}}</el-form-item>
                  <el-form-item label="财务出纳人" style="height: 20px" >{{ props.row.payer.name}}</el-form-item>
                </el-form>
              </el-col>
              <el-col :span="3">
                <el-form label-position="left" style="height: 20px;">
                  <el-form-item label="一级审批" style="height: 20px"><el-tag class="tag" :type="props.row.firstStatus | approvalStatusFilter">{{props.row.firstStatus | approvalStatus}}</el-tag></el-form-item>
                  <el-form-item label="二级审批" style="height: 20px"><el-tag class="tag" :type="props.row.secondStatus | approvalStatusFilter">{{props.row.secondStatus | approvalStatus}}</el-tag></el-form-item>
                  <el-form-item label="三级审批" style="height: 20px"><el-tag class="tag" :type="props.row.thirdStatus | approvalStatusFilter">{{props.row.thirdStatus | approvalStatus}}</el-tag></el-form-item>
                  <el-form-item label="四级审批" style="height: 20px" v-if="props.row.money > 3000"><el-tag class="tag" :type="props.row.fourthStatus | approvalStatusFilter">{{props.row.fourthStatus | approvalStatus}}</el-tag></el-form-item>
                  <el-form-item label="财务处理" style="height: 20px"><el-tag class="tag" :type="props.row.financialStatus | financialStatusFilter">{{props.row.financialStatus | approvalFinancialStatus}}</el-tag></el-form-item>
                </el-form>
              </el-col>
              <el-col :span="3">
                <el-form label-position="left" style="height: 20px;">
                  <el-form-item label="审批时间" style="height: 20px"><el-tag class="tag" :type="props.row.firstStatus | approvalStatusFilter">{{props.row.first_time | parseTime}}</el-tag></el-form-item>
                  <el-form-item label="审批时间" style="height: 20px"><el-tag class="tag" :type="props.row.secondStatus | approvalStatusFilter">{{props.row.second_time | parseTime}}</el-tag></el-form-item>
                  <el-form-item label="审批时间" style="height: 20px"><el-tag class="tag" :type="props.row.thirdStatus | approvalStatusFilter">{{props.row.third_time | parseTime}}</el-tag></el-form-item>
                  <el-form-item label="审批时间" style="height: 20px" v-if="props.row.money > 3000"><el-tag class="tag" :type="props.row.fourthStatus | approvalStatusFilter">{{props.row.fourth_time | parseTime}}</el-tag></el-form-item>
                  <el-form-item label="审批时间" style="height: 20px"><el-tag class="tag" :type="props.row.financialStatus | financialStatusFilter">{{props.row.financial_time | parseTime}}</el-tag></el-form-item>
                  <el-form-item label="打款时间" style="height: 20px"><el-tag class="tag" :type="props.row.financialStatus | financialStatusFilter">{{props.row.payer_time | parseTime}}</el-tag></el-form-item>
                </el-form>
              </el-col>
              <el-col :span="9" style="width: 420px">
                <el-form label-position="left" inline style="height: 30px;width: 300px">
                  <el-form-item label="报销类型">{{ props.row.type_name }}</el-form-item>
                </el-form>
                <el-form label-position="left" inline style="height: 30px;width: 600px">
                  <el-form-item label="所属分组" v-if="props.row.applyType_id === 1">{{ props.row.group.name}}</el-form-item>
                  <el-form-item label="所属项目" v-if="props.row.applyType_id !== 1">{{ props.row.project.name }}</el-form-item>
                </el-form>
                <el-form label-position="left" inline style="height: 110px;width: 300px">
                  <el-form-item label="具体用途">
                    <el-input style="width: 332px;height: 320px;padding-left: 5px;padding-right: 5px;margin-top: 5px;" readonly
                              type="textarea" :autosize="{ minRows: 4, maxRows: 4}" v-model="props.row.use">
                    </el-input>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="7" style="width: 420px">
                <el-form label-position="left" inline style="height: 110px">
                  <el-form label-position="left" inline style="height: 30px;width: 300px">
                    <el-form-item label="报销人">{{ props.row.cost_user_name }}</el-form-item>
                    <el-form-item label="申请人">{{ props.row.input_user_name }}</el-form-item>
                  </el-form>
                  <el-form label-position="left" inline style="height: 30px">
                    <el-form-item label="面单科目">{{ props.row.sbj_name }}</el-form-item>
                  </el-form>
                  <el-form label-position="left" inline style="height: 30px">
                    <el-form-item label="实际科目">{{ props.row.sbjR_name }}</el-form-item>
                  </el-form>
                  <el-form-item label="报销备注">
                    <el-input style="width: 250px;height: 320px;padding-left: 5px;padding-right: 5px;margin-top: 5px;" readonly
                              type="textarea" :autosize="{ minRows: 4, maxRows: 4}" v-model="props.row.note">
                    </el-input>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="ID" width="65"></el-table-column>
        <el-table-column prop="cost_id" label="生效ID" width="70" v-if="checkBox.show_cost_id"></el-table-column>
        <el-table-column label="报销单号________(条数)" width="240" v-if="checkBox.showReceipt_no">
          <template slot-scope="scope">
            <el-row>
              <el-col>
                {{scope.row.receipt_no}}
                <el-button v-clipboard:copy="scope.row.receipt_no" v-clipboard:success="onCopy" type="text">复制</el-button>
                <a style="text-align: right;font-size: 10px">(共{{scope.row.receipt_total===null?0:scope.row.receipt_total}}条)</a>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column prop="proof_no" label="凭证编号" width="150" v-if="checkBox.showProof"></el-table-column>
        <el-table-column prop="date" label="申请日期" sortable="custom" width="120" :formatter="dateFormat"></el-table-column>
        <el-table-column prop="cost_user_name" label="报销人" width="90"></el-table-column>
        <el-table-column prop="input_user_name" label="申请人" width="90" v-if="checkBox.showInputUser"></el-table-column>
        <el-table-column prop="applyType_id" label="申请类型" :formatter="applyTypeFormat" width="100" v-if="checkBox.showApplyType"></el-table-column>
        <el-table-column prop="type_name" label="报销类型" width="100" v-if="checkBox.showCostType"></el-table-column>
        <el-table-column prop="sbj_name" label="面单科目" width="160" v-if="checkBox.showSbj"></el-table-column>
        <el-table-column prop="sbjR_name" label="实际科目" width="160" v-if="checkBox.showSbjR"></el-table-column>
        <el-table-column label="项目/分组" width="350" v-if="checkBox.showProject">
          <template slot-scope="scope">
            <a style="width: 332px;padding-left: 5px;padding-right: 5px;margin-top: 15px;" v-if="scope.row.applyType_id===1">{{scope.row.group.name}}</a>
            <a style="width: 332px;padding-left: 5px;padding-right: 5px;margin-top: 15px;" v-if="scope.row.applyType_id!==1">{{scope.row.project.name}}</a>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="money" label="申请金额" width="120"></el-table-column>
        <el-table-column prop="use" label="用途" width="500" v-if="checkBox.showUse" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="一级审批" width="150" v-if="checkBox.showApproved">
          <template slot-scope="scope">
            <el-tag class="tag" :type="scope.row.firstStatus | approvalStatusFilter">{{scope.row.firstStatus | approvalStatus}}( {{ scope.row.first.name }} )</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="二级审批" width="150" v-if="checkBox.showApproved">
          <template slot-scope="scope">
            <el-tag class="tag" :type="scope.row.secondStatus | approvalStatusFilter">{{scope.row.secondStatus | approvalStatus}}( {{ scope.row.second.name }} )</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="三级审批" width="150" v-if="checkBox.showApproved">
          <template slot-scope="scope">
            <el-tag class="tag" :type="scope.row.thirdStatus | approvalStatusFilter">{{scope.row.thirdStatus | approvalStatus}}( {{ scope.row.third.name }} )</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="四级审批" width="150" v-if="checkBox.showApproved">
          <template slot-scope="scope" v-if="scope.row.money > 3000">
            <el-tag class="tag" :type="scope.row.fourthStatus | approvalStatusFilter">{{scope.row.fourthStatus | approvalStatus}}( {{ scope.row.fourth.name }} )</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="财务处理" width="100">
          <template slot-scope="scope">
            <el-tag class="tag" type="danger" v-if="approvalRefuse(scope.row)">不通过</el-tag>
            <el-tag class="tag" :type="scope.row.financialStatus | financialStatusFilter" v-else>{{scope.row.financialStatus | approvalFinancialStatus}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="financial_time" label="财务审批时间" sortable="custom" width="165" :formatter="dateFormat2" v-if="checkBox.showPassTime"></el-table-column>
        <el-table-column prop="payer_time" label="财务打款时间" sortable="custom" width="165" :formatter="dateFormat2" v-if="checkBox.showPayerTime"></el-table-column>
        <el-table-column prop="comment" label="审批备注" width="250" v-if="checkBox.showReason"></el-table-column>
        <el-table-column align="center" width="230" fixed="left" label="审批操作" v-if="checkBox.showAction1">
          <template slot-scope="scope">
            <el-button
              @click="onClickUpdate(scope.row)"
              :disabled="updateDisabledFilter(scope.row)"
              :type="updateTypeFilter(scope.row)"
              icon="el-icon-edit"
              class="pass-button"
              size="mini">{{updateStatusFilter(scope.row)}}</el-button>
            <el-button
              @click="onClickPass(scope.row)"
              :disabled="passDisabledFilter(scope.row)"
              :type="passTypeFilter(scope.row)"
              icon="el-icon-success"
              class="pass-button"
              size="mini">{{passStatusFilter(scope.row)}}</el-button>
            <el-button
              @click="onClickRefuse(scope.row)"
              :disabled="refuseDisabledFilter(scope.row)"
              :type="refuseTypeFilter(scope.row)"
              icon="el-icon-error"
              class="pass-button"
              size="mini">{{refuseStatusFilter(scope.row)}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--表单部分-->
    <el-dialog title="修改申请" :visible.sync="visible.reviseForm" style="width: 1100px" >
      <el-form :rules="rules" :model="reviseForm" ref="reviseForm" label-width="100px" size="mini">
        <el-form-item label="日期" >
          <el-date-picker v-model="reviseForm.date" value-format="timestamp" type="date" placeholder="选择日期" :disabled="true"></el-date-picker>
        </el-form-item>
        <el-form-item label="报销人" >
          <el-input style="width: 100px" v-model="reviseForm.cost_user_name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="申请人" >
          <el-input style="width: 100px" v-model="reviseForm.input_user_name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="申请类型" prop="applyType_id">
          <el-select v-model="reviseForm.applyType_id" filterable placeholder="请选择申请类型" @change="statusChange(reviseForm.applyType_id)">
            <el-option v-for="applyType in applyTypes" :key="applyType.id" :label="applyType.name" :value="applyType.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属项目" prop="pro_id" v-if="isGroup === false">
          <el-select
            v-model="reviseForm.pro_id"
            filterable
            remote
            reserve-keyword
            placeholder="关键词搜索，空格表示全部"
            :remote-method="remoteProjects"
            style="width: 100%">
            <el-option v-for="pro in pros" :key="pro.id" :label="pro.name" :value="pro.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属分组" prop="group_id" v-if="isGroup === true">
          <el-select
            v-model="reviseForm.group_id"
            filterable
            remote
            reserve-keyword
            placeholder="关键词搜索，空格表示全部"
            :remote-method="remoteGroups"
            style="width: 100%">
            <el-option v-for="group in groups" :key="group.id" :label="group.name" :value="group.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="报销类型" prop="type_id">
          <el-select v-model="reviseForm.type_id" placeholder="请选择">
            <el-option v-for="type in types" :key="type.id" :label="type.name" :value="type.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="面单科目" prop="sbj_id">
          <el-select v-model="reviseForm.sbj_id" placeholder="请选择">
            <el-option v-for="sbj in sbjs" :key="sbj.id" :label="sbj.name" :value="sbj.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="实际科目" prop="sbjR_id">
          <el-select v-model="reviseForm.sbjR_id" placeholder="请选择">
            <el-option v-for="sbj in sbjs" :key="sbj.id" :label="sbj.name" :value="sbj.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="金额">
          <el-input style="width: 150px" v-model="reviseForm.money" :disabled="false"></el-input>
        </el-form-item>
        <el-form-item label="报销用途" prop="use" >
          <el-input type="textarea" autosize style="width: 300px" v-model="reviseForm.use" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="报销备注" prop="note">
          <el-input type="textarea" autosize style="width: 300px" v-model="reviseForm.note" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitReviseForm('reviseForm')">确定修改</el-button>
        <el-button @click="visible.reviseForm = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<!--
    Permissions on this page:
    页面访问: read_Financial_pageApplyAll   beforeMount()
-->
<script>
  import { getFinance, payApply, updateApply } from '../../../../api/costApply'
  import { parseTime } from '../../../../utils/index'
  import { getType, getSbjType } from '../../../../api/costBasic'
  import { getUsers } from '../../../../api/user'
  import { getProjects } from '../../../../api/project'
  import { getGroups } from '../../../../api/costGeneral'
  import { getUserConfig, updateUserConfig } from '../../../../api/userConfig'

  export default {
    name: 'applyAll',
    data() {
      return {
        // 数据源类 users：所有用户 types：报销类型 groups：全部分组 pros：全部项目 projects：全部项目 sbjs：全部科目明细 costUsers：全部员工 applications：全部申请
        users: [],
        types: [],
        sbjs: [],
        pros: [],
        groups: [],
        projects: [],
        costUsers: [],
        applications: [],
        // 表格多选类 sum：金额合计 num： 选中合计 multipleSelection：被选中的项
        sum: 0,
        num: 0,
        multipleSelection: [],
        showEdit: [],
        showBtn: [],
        showBtnOrdinary: true,
        // 全局获取登录人ID
        myId: this.$store.getters.userId,
        // 显示头部搜索组件
        showCheckbox: true,
        // 是否是综合报销
        isGroup: null,
        // 审批状态表单
        updateForm: {
          id: null,
          financialStatus: null,
          comment: '',
          proof_no: null
        },
        // 申请内容表单
        reviseForm: {
          date: null,
          cost_user_id: null,
          input_user_id: null,
          applyType_id: null,
          pro_id: null,
          group_id: null,
          type_id: null,
          sbj_id: null,
          sbjR_id: null,
          start_id: null,
          end_id: null,
          cost_user_name: null,
          input_user_name: null,
          money: null,
          use: null,
          note: null
        },
        // 对话框可视
        visible: {
          reviseForm: false,
          showHelp: false
        },
        // 总页数
        pageInfo: {
          currentPage: 1,
          pageSize: 20,
          totalCount: 0
        },
        // 表格切换选择器当前选择项
        choseStatus: 'one',
        // 加载动画
        loading: false,
        // 头部查询组件远程搜索时的加载动画
        loading_search: {
          cost_user: false,
          input_user: false,
          project: false,
          group: false,
          subject: false
        },
        // 查询请求表单
        queryForm: {
          start_at: null,
          end_at: null,
          pro_id: null,
          group_id: null,
          cost_user_id: null,
          input_user_id: null,
          date: [],
          payer_time: [],
          sbj_id: null,
          applyType_id: null,
          branch_id: null,
          sort: null,
          sort_name: null
        },
        // 申请类型数组
        applyTypes: [
          { id: 1, name: '综合报销' },
          { id: 2, name: '基础报销' },
          { id: 3, name: '物资采购' },
          { id: 4, name: '工人付款' }
        ],
        // 时间选择器默认快捷选项
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        // 多选框
        checkBox: {
          showProject: false,
          showGroup: false,
          showInputUser: true,
          showApplyType: false,
          showApproved: false,
          showAction1: true,
          showCostType: true,
          showHighLight: false,
          showProof: false,
          show_cost_id: false,
          showSbj: false,
          showSbjR: true,
          showUse: true,
          showReason: true,
          showPassTime: true,
          showPayerTime: true,
          showReceipt_no: true
        },
        // 修改表单检查规则
        rules: {
          branch_id: [
            { required: true, message: '分公司不得为空', trigger: 'blur' }
          ],
          group_id: [
            { required: true, message: '所属分组名称不得为空', trigger: 'blur' }
          ],
          pro_id: [
            { required: true, message: '所属项目名称不得为空', trigger: 'blur' }
          ],
          type_id: [
            { required: true, message: '报销类型不得为空', trigger: 'blur' }
          ],
          sbj_id: [
            { required: true, message: '报销科目不得为空', trigger: 'blur' }
          ],
          use: [
            { required: true, message: '报销实际用途不得为空', trigger: 'blur' }
          ]
        }
      }
    },
    filters: {
      approvalStatus: function(value) {
        if (value === null || value === '' || value === 0) {
          return '待审批'
        }
        if (value === 1) {
          return '已通过'
        }
        if (value === 2) {
          return '不通过'
        }
      }, // 一级到四级的审批状态过滤器
      approvalFinancialStatus: function(value) {
        if (value === null || value === '' || value === 0) {
          return '待审批'
        }
        if (value === 1) {
          return '待拨款'
        }
        if (value === 2) {
          return '已拨款'
        }
        if (value === 3) {
          return '异常'
        }
      }, // 财务审批状态过滤器
      approvalStatusFilter(status) {
        const statusMap = {
          0: '',
          1: 'success',
          2: 'danger'
        }
        return statusMap[status]
      }, // 一级到四级的审批状态tag标签过滤器
      financialStatusFilter(status) {
        const statusMap = {
          0: '',
          1: 'warning',
          2: 'success',
          3: 'danger'
        }
        return statusMap[status]
      }, // 财务审批状态tag标签过滤器
      parseTime(value) {
        value = value.toString()
        if (value === '1514736000') {
          return '暂无'
        } else return parseTime(value, '{y}-{m}-{d} {h}:{i}:{s}')
      } // 时间格式转换
    },
    methods: {
      /** 点击事件类 */
      onRemember() {
        // 对象转JSON
        const jsonStr = JSON.stringify(this.checkBox)
        const params = { financialExchanges_applyAll_tableShow: jsonStr }
        updateUserConfig(params).then(res => {
          if (res.data.bCode === 101) {
            this.$notify({ title: '成功', message: '已成功记住我的选择!', type: 'success', position: 'top-right' })
          } else {
            this.$notify({ title: '失败', message: res.data.bData, type: 'warning', position: 'top-right' })
          }
        })
      },
      onQuery() {
        this.loading = true
        getFinance(this.finalSearchForm).then(res => {
          this.applications = res.data._items
          this.pageInfo.totalCount = res.data._meta.totalCount
          this.loading = false
        })
      },
      onClearQuery() {
        this.queryForm = {
          start_at: null,
          end_at: null,
          pro_id: null,
          group_id: null,
          cost_user_id: null,
          input_user_id: null,
          date: [],
          payer_time: [],
          sbj_id: null,
          applyType_id: null,
          branch_id: null,
          sort: null,
          sort_name: null
        }
        this.onQuery()
      },
      onClickPass(row) {
        this.$confirm('您将审批并<a style="color: #3a8ee6">同意</a>该申请,确认后该申请将无法再修改!<br />是否确认<a style="color: #3a8ee6">同意申请?</a>', '审批申请', {
          confirmButtonText: '确认审批',
          cancelButtonText: '我再想想',
          type: 'warning',
          center: true,
          dangerouslyUseHTMLString: true
        }).then(() => {
          this.updateForm.financialStatus = 1
          this.updateForm.id = row.id
          payApply(this.updateForm).then(res => {
            this.choseStatus = 'one'
            this.fetchMine(this.finalSearchForm)
            this.resetForm()
            this.$message({
              type: 'success',
              message: '审批通过成功!'
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
          this.resetForm()
        })
      }, // 同意
      onClickRefuse(row) {
        this.$prompt('是否确认将该申请审核为<a style="color: darkred">异常</a>状态? 审核后将无法再修改!<br /><a style="color: darkred">您需要通知申请人修正异常后重新发起申请!<br />请您在下方备注栏填写异常原因!</a>', '审核异常', {
          inputPlaceholder: '请填写异常原因,该内容将只有财务和申请人可见',
          confirmButtonText: '确认异常',
          cancelButtonText: '我再想想',
          type: 'warning',
          center: true,
          dangerouslyUseHTMLString: true,
          inputValue: row.comment
        }).then(({ value }) => {
          this.updateForm.comment = value
          this.updateForm.financialStatus = 3
          this.updateForm.id = row.id
          payApply(this.updateForm).then(res => {
            this.choseStatus = 'one'
            this.fetchMine(this.finalSearchForm)
            this.$message({
              type: 'success',
              message: '审批异常成功!'
            })
            this.resetForm()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
          this.resetForm()
        })
      }, // 审批异常
      onClickUpdate(row) {
        this.myId = this.$store.getters.userId
        if (this.myId === row.financial_id) {
          this.reviseForm = Object.assign({}, row)
          this.reviseForm.date = this.reviseForm.date * 1000
          this.isGroup = row.applyType_id === 1
          this.visible.reviseForm = true
        } else {
          this.$message({
            type: 'error',
            message: '您不是审批人,无权修改!'
          })
        }
      }, // 修改
      onChangeChose() {
        this.loading = true
        if (this.choseStatus === 'one') {
          this.fetchMine(this.finalSearchForm)
          this.checkBox.showAction1 = true
        }
        if (this.choseStatus === 'two') this.fetchApproved(this.finalSearchForm)
        if (this.choseStatus === 'three') {
          this.fetchPaying(this.finalSearchForm)
          this.checkBox.showAction1 = false
        }
        if (this.choseStatus === 'four') {
          this.fetchPaid(this.finalSearchForm)
          this.checkBox.showAction1 = false
        }
        if (this.choseStatus === 'five') {
          this.fetchApply(this.finalSearchForm)
          this.checkBox.showAction1 = false
        }
        if (this.choseStatus === 'six') {
          this.fetchFailed(this.finalSearchForm)
          this.checkBox.showAction1 = false
        }
      }, // 选择器被选择
      onClickEntry(row) {
        this.$prompt('<a style="color: darkred">请在下方填写凭证编号:</a>', '确认', {
          inputPlaceholder: '打款凭证号',
          confirmButtonText: '确认已打款',
          cancelButtonText: '我再想想',
          type: 'warning',
          center: true,
          dangerouslyUseHTMLString: true,
          inputValue: row.proof_no
        }).then(({ value }) => {
          this.updateForm.proof_no = value
          this.updateForm.id = row.id
          payApply(this.updateForm).then(res => {
            if (this.choseStatus === 'three') {
              this.choseStatus = 'three'
              this.fetchPaying(this.finalSearchForm)
            } else if (this.choseStatus === 'four') {
              this.choseStatus = 'four'
              this.fetchPaid(this.finalSearchForm)
            } else if (this.choseStatus === 'one') {
              this.choseStatus = 'one'
              this.fetchMine(this.finalSearchForm)
            } else if (this.choseStatus === 'six') {
              this.choseStatus = 'six'
              this.fetchFailed(this.finalSearchForm)
            }
          })
          this.$message({
            type: 'success',
            message: '修改凭证编号成功！'
          })
          this.resetForm()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
          this.resetForm()
        })
      },
      onBatchPass() {
        // 1.检查是否超过15条
        if (this.num > 15) {
          this.$message({ type: 'error', message: '抱歉，批量审批最多不得超过15条！（如要修改限制，请联系管理员）' })
          return
        }
        // 2.循环遍历出被选择项id,将可以审批的id集合为ids,将无法审批的id集合为ids_，可以审批的申请总金额为sum
        let ids = ''
        let sum = 0
        let ids_ = ''
        const res = this.multipleSelection
        for (let i = 0; i < this.num; i++) {
          if (res[i].fourthStatus === 1 && res[i].financialStatus === 0 && res[i].financial_id === this.myId) {
            ids = res[i].id + ',' + ids
            sum += Number(res[i].money)
          } else ids_ = res[i].id + ',' + ids_
        }
        // 3.弹出提示框
        this.$confirm('您将审批通过的申请ID为：' + ids + '<br />' + '被审批的申请总金额为：' + sum + '<br />' + '被选中的申请中无法审批的申请ID为：' + ids_, '批量审批提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true,
          dangerouslyUseHTMLString: true
        }).then(() => {
          this.batchCreate(0, this.num, res)
          this.$message({ type: 'success', message: '批量审批成功!' })
        }).catch(() => {
          this.$message({ type: 'info', message: '取消操作' })
        })
      },
      batchCreate(start, end, res) {
        this.resetForm()
        // 判断1：一级待审且本人
        if (res[start].fourthStatus === 1 && res[start].financialStatus === 0 && res[start].financial_id === this.myId) {
          // 填充被审ID
          this.updateForm.id = res[start].id
          this.updateForm.financialStatus = 1
          // 进行提交
          payApply(this.updateForm).then(res_ => {
            this.resetForm()
            if (start < end - 1) {
              setTimeout(this.batchCreate(start + 1, end, res), 150)
            } else {
              this.choseStatus = 'one'
              this.fetchMine(this.finalSearchForm)
            }
          })
        }
      },
      onBatchRefuse() {
        this.$message({ type: 'error', message: '抱歉，考虑到无法填写拒绝原因，暂不支持批量拒绝!' })
      },
      onCopy() {
        this.$message({
          message: '已复制',
          type: 'success'
        })
      },
      /** -------- 接口获取类 -------- */
      fetchApply(params) {
        this.loading = true
        getFinance(params).then(res => {
          this.applications = res.data._items
          this.pageInfo.totalCount = res.data._meta.totalCount
          this.loading = false
        })
        // this.start()
      }, // 获取所有申请记录
      fetchMine(params) {
        this.loading = true
        const res = Object.assign({}, params, { 'queryMine': '1' })
        getFinance(res).then(res => {
          this.applications = res.data._items
          this.pageInfo.totalCount = res.data._meta.totalCount
          this.loading = false
        })
      }, // 获取待我审批的申请
      fetchApproved(params) {
        this.loading = true
        const res = Object.assign({}, params, { 'approved': '1' })
        getFinance(res).then(res => {
          this.applications = res.data._items
          this.pageInfo.totalCount = res.data._meta.totalCount
          this.loading = false
        })
      }, // 获取我已审批的申请
      fetchPaying(params) {
        this.loading = true
        const res = Object.assign({}, params, { 'waitPaying': '1' })
        getFinance(res).then(res => {
          this.applications = res.data._items
          this.pageInfo.totalCount = res.data._meta.totalCount
          this.loading = false
        })
      }, // 获取所有待付款的申请
      fetchPaid(params) {
        this.loading = true
        const res = Object.assign({}, params, { 'queryPaid': '1' })
        getFinance(res).then(res => {
          this.applications = res.data._items
          this.pageInfo.totalCount = res.data._meta.totalCount
          this.loading = false
        })
      }, // 获取所有已付款的申请
      fetchFailed(params) {
        this.loading = true
        const res = Object.assign({}, params, { 'queryFailed': '1' })
        getFinance(res).then(res => {
          this.applications = res.data._items
          this.pageInfo.totalCount = res.data._meta.totalCount
          this.loading = false
        })
      }, // 获取所有财务异常的申请
      fetchType() {
        getType().then(res => {
          this.types = res.data
        })
      }, // 获取所有报销类型
      fetchSbjType() {
        getSbjType().then(res => {
          this.sbjs = res.data
        })
      }, // 获取所有报销科目
      fetchProjects() {
        getProjects().then(res => {
          this.pros = res.data._items
        })
      },
      fetchGroups() {
        getGroups().then(res => {
          this.groups = res.data._items
        })
      },
      fetchUserConfig() {
        getUserConfig().then(res => {
          if (res.data.financialExchanges_applyAll_tableShow !== null) {
            this.$notify({ title: '已读取云端配置', message: '已读取您记住的选项!', type: 'success', position: 'top-right' })
            const jsObject = JSON.parse(res.data.financialExchanges_applyAll_tableShow)
            this.checkBox = Object.assign({}, jsObject)
          } else {
            console.log('读取失败,可能是用户未保存选项')
          }
        })
      }, // 读取用户保存的表项显示配置项
      /** -------- 表单处理类 --------- */
      submitReviseForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.reviseForm.date = Math.floor(this.reviseForm.date / 1000)
            updateApply(this.reviseForm).then(res => {
              if (res.data.bCode === 101) {
                this.$notify({
                  title: '成功',
                  message: '修改成功',
                  type: 'success',
                  position: 'top-right'
                })
                this.fetchMine()
              } else {
                this.$notify({
                  title: '警告',
                  message: res.data.bData,
                  type: 'warning',
                  position: 'top-right'
                })
              }
              this.visible.reviseForm = false
            })
          } else {
            console.log('提交错误!!')
            return false
          }
        })
      },
      resetForm() {
        this.updateForm = {
          id: null,
          financialStatus: null,
          comment: '',
          proof_no: null
        }
      },
      /** -------- 表格样式类 -------- */
      rowStyle({ row, rowIndex }) {
        if (this.checkBox.showHighLight === true) {
          if (row.financialStatus === 0) return 'background-color: rgb(245, 250, 255);height: 25px'
          else if (row.financialStatus === 1) return 'background-color: rgb(255, 253, 248);height: 25px'
          else if (row.financialStatus === 2) return 'background-color: #f0f9eb;height: 25px'
          else if (row.financialStatus === 3) return 'background-color: rgb(249, 224, 224);height: 25px'
          else return 'height: 25px'
        } else {
          return 'height: 25px'
        }
      },
      cellStyle({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 1) {
          return 'background: rgb(64, 158, 255);padding: 2px'
        } else {
          return 'padding: 2px'
        }
      },
      /** -------- 过滤类 -------- */
      applyTypeFormat(row, column) {
        if (row[column.property] === 1) {
          return '综合报销'
        }
        if (row[column.property] === 2) {
          return '基础报销'
        }
        if (row[column.property] === 3) {
          return '物资采购'
        }
        if (row[column.property] === 4) {
          return '工人付款'
        }
      }, // 表格中根据申请类型过滤,显示分组名称或者项目名称
      approvalRefuse(row) {
        if (row.firstStatus === 2 || row.secondStatus === 2 || row.thirdStatus === 2 || row.fourthStatus === 2) return true
      },
      approvalStatus_: function(value) {
        if (value === null || value === '' || value === 0) {
          return '待审批'
        }
        if (value === 1) {
          return '已通过'
        }
        if (value === 2) {
          return '不通过'
        }
      }, // 表格中一级到四级的审批状态过滤器
      approvalFinancialStatus_: function(value) {
        if (value === null || value === '' || value === 0) {
          return '待审批'
        }
        if (value === 1) {
          return '待拨款'
        }
        if (value === 2) {
          return '已拨款'
        }
        if (value === 3) {
          return '异常'
        }
      }, // 表格中财务审批状态过滤器
      statusFormat(row, column) {
        if (row.money <= 3000) {
          // 如果金额小于3000,三级审核
          if (row.firstStatus === 1) {
            if (row.secondStatus === 1) {
              if (row.thirdStatus === 1) {
                return this.approvalFinancialStatus_(row.financialStatus)
              } else return this.approvalStatus_(row.thirdStatus)
            } else return this.approvalStatus_(row.secondStatus)
          } else return this.approvalStatus_(row.firstStatus)
        } else {
          // 如果金额大于3000,四级审核
          if (row.firstStatus === 1) {
            if (row.secondStatus === 1) {
              if (row.thirdStatus === 1) {
                if (row.fourthStatus === 1) {
                  return this.approvalFinancialStatus_(row.financialStatus)
                } else return this.approvalStatus_(row.fourthStatus)
              } else return this.approvalStatus_(row.thirdStatus)
            } else return this.approvalStatus_(row.secondStatus)
          } else return this.approvalStatus_(row.firstStatus)
        }
      }, // 表格中根据每级审核状态过滤,显示当前申请的最终状态
      dateFormat(row, column) {
        const date = row[column.property]
        return parseTime(date, '{y}-{m}-{d}')
      }, // 时间格式化
      dateFormat2(row, column) {
        const date = row[column.property]
        if (date === 1514736000) {
          return '暂无'
        } else return parseTime(date, '{y}-{m}-{d} {h}:{i}:{s}')
      }, // 时间格式化
      updateStatusFilter(row) {
        // 过滤器思想:财务处理状态为待审且登录人员为指定的审批人员,并且金额小于等于3000时三级审批状态为已审批,则显示'通过'按钮!否则显示'暂无'
        this.myId = this.$store.getters.userId
        if (row.financialStatus === 0 && row.financial_id === this.myId) {
          if (row.money <= 3000 && row.thirdStatus === 1) return '修改'
          else if (row.money > 3000 && row.fourthStatus === 1) return '修改'
          else return '暂无'
        } else return '暂无'
      }, // 修改按钮的操作按钮文字过滤器
      updateTypeFilter(row) {
        // 过滤器思想:财务处理状态为待审且登录人员为指定的审批人员,并且金额小于等于3000时三级审批状态为已审批,则蓝色按钮!否则显示无色按钮!
        this.myId = this.$store.getters.userId
        if (row.financialStatus === 0 && row.financial_id === this.myId) {
          if (row.money <= 3000 && row.thirdStatus === 1) return 'primary'
          else if (row.money > 3000 && row.fourthStatus === 1) return 'primary'
          else return ''
        } else return ''
      }, // 修改按钮的操作按钮type过滤器
      updateDisabledFilter(row) {
        // 过滤器思想:财务处理状态为待审且登录人员为指定的审批人员,并且金额小于等于3000时三级审批状态为已审批,则不禁止!否则显示禁止!
        this.myId = this.$store.getters.userId
        if (row.financialStatus === 0 && row.financial_id === this.myId) {
          if (row.money <= 3000 && row.thirdStatus === 1) return false
          else return !(row.money > 3000 && row.fourthStatus === 1)
        } else return true
      }, // 修改按钮的禁止属性过滤器
      passStatusFilter(row) {
        // 过滤器思想:财务处理状态为待审且登录人员为指定的审批人员,并且金额小于等于3000时三级审批状态为已审批,则显示'通过'按钮!否则显示'暂无'
        this.myId = this.$store.getters.userId
        if (row.financialStatus === 0 && row.financial_id === this.myId) {
          if (row.money <= 3000 && row.thirdStatus === 1) return '通过'
          else if (row.money > 3000 && row.fourthStatus === 1) return '通过'
          else return '暂无'
        } else return '暂无'
      }, // 同意按钮的操作按钮文字过滤器
      passTypeFilter(row) {
        // 过滤器思想:财务处理状态为待审且登录人员为指定的审批人员,并且金额小于等于3000时三级审批状态为已审批,则蓝色按钮!否则显示无色按钮!
        this.myId = this.$store.getters.userId
        if (row.financialStatus === 0 && row.financial_id === this.myId) {
          if (row.money <= 3000 && row.thirdStatus === 1) return 'success'
          else if (row.money > 3000 && row.fourthStatus === 1) return 'success'
          else return ''
        } else return ''
      }, // 同意按钮的操作按钮type过滤器
      passDisabledFilter(row) {
        // 过滤器思想:财务处理状态为待审且登录人员为指定的审批人员,并且金额小于等于3000时三级审批状态为已审批,则不禁止!否则显示禁止!
        this.myId = this.$store.getters.userId
        if (row.financialStatus === 0 && row.financial_id === this.myId) {
          if (row.money <= 3000 && row.thirdStatus === 1) return false
          else return !(row.money > 3000 && row.fourthStatus === 1)
        } else return true
      }, // 同意按钮的禁止属性过滤器
      refuseStatusFilter(row) {
        // 过滤器思想:财务处理状态为待审且登录人员为指定的审批人员,并且金额小于等于3000时三级审批状态为已审批,则显示'异常'按钮!否则显示'暂无'
        this.myId = this.$store.getters.userId
        if (row.financialStatus === 0 && row.financial_id === this.myId) {
          if (row.money <= 3000 && row.thirdStatus === 1) return '异常'
          else if (row.money > 3000 && row.fourthStatus === 1) return '异常'
          else return '暂无'
        } else return '暂无'
      }, // 拒绝按钮的操作按钮文字过滤器
      refuseTypeFilter(row) {
        // 过滤器思想:财务处理状态为待审且登录人员为指定的审批人员,并且金额小于等于3000时三级审批状态为已审批,则显示红色按钮!否则显示无色
        this.myId = this.$store.getters.userId
        if (row.financialStatus === 0 && row.financial_id === this.myId) {
          if (row.money <= 3000 && row.thirdStatus === 1) return 'danger'
          else if (row.money > 3000 && row.fourthStatus === 1) return 'danger'
          else return ''
        } else return ''
      }, // 拒绝按钮的操作按钮type过滤器
      refuseDisabledFilter(row) {
        // 过滤器思想:财务处理状态为待审且登录人员为指定的审批人员,并且金额小于等于3000时三级审批状态为已审批,则不禁止,否则禁止
        this.myId = this.$store.getters.userId
        if (row.financialStatus === 0 && row.financial_id === this.myId) {
          if (row.money <= 3000 && row.thirdStatus === 1) return false
          else return !(row.money > 3000 && row.fourthStatus === 1)
        } else return true
      }, // 拒绝按钮的禁止属性过滤器
      payStatusFilter(row) {
        // 过滤器思想:财务处理状态为待拨款且登录人员为指定的拨款人员,为待拨款,则显示'打款'按钮!否则显示'暂无'
        this.myId = this.$store.getters.userId
        if (row.financialStatus === 1 && row.payer_id === this.myId) {
          return '打款'
        } else return '暂无'
      }, // 拨款按钮的操作按钮文字过滤器
      payTypeFilter(row) {
        // 过滤器思想:财务处理状态为待拨款且登录人员为指定的拨款人员,为待拨款,则显示蓝色按钮!否则显示无色
        this.myId = this.$store.getters.userId
        if (row.financialStatus === 1 && row.payer_id === this.myId) {
          return 'primary'
        } else return ''
      }, // 拨款按钮的操作按钮type过滤器
      payDisabledFilter(row) {
        // 过滤器思想:财务处理状态为待审且登录人员为指定的审批人员,为待拨款,则不禁止,否则禁止
        this.myId = this.$store.getters.userId
        return !(row.financialStatus === 1 && row.payer_id === this.myId)
      }, // 拨款按钮的禁止属性过滤器
      failedStatusFilter(row) {
        // 过滤器思想:财务处理状态为待拨款且登录人员为指定的拨款人员,为待拨款,则显示'异常'按钮!否则显示'暂无'
        this.myId = this.$store.getters.userId
        if (row.financialStatus === 1 && row.payer_id === this.myId) {
          return '异常'
        } else if (row.financialStatus === 2 && row.payer_id === this.myId) {
          return '异常'
        } return '暂无'
      }, // 拨款异常按钮的操作按钮文字过滤器
      failedTypeFilter(row) {
        // 过滤器思想:财务处理状态为待拨款且登录人员为指定的拨款人员,为待拨款,则显示红色按钮!否则显示无色
        this.myId = this.$store.getters.userId
        if (row.financialStatus === 1 && row.payer_id === this.myId) {
          return 'danger'
        } else if (row.financialStatus === 2 && row.payer_id === this.myId) {
          return 'danger'
        } return ''
      }, // 拨款异常按钮的操作按钮type过滤器
      failedDisabledFilter(row) {
        // 过滤器思想:财务处理状态为待审且登录人员为指定的审批人员,为待拨款,则不禁止,否则禁止
        this.myId = this.$store.getters.userId
        if (row.financialStatus === 1 && row.payer_id === this.myId) {
          return false
        } else if (row.financialStatus === 2 && row.payer_id === this.myId) {
          return false
        } return true
      }, // 拨款异常按钮的禁止属性过滤器
      selectChecked() {
        if (this.queryForm.date.length > 0) {
          this.queryForm.start_at = this.queryForm.date[0]
          this.queryForm.end_at = this.queryForm.date[1]
        }
        // 判断选择器的选项
        if (this.choseStatus === 'one') {
          return Object.assign({}, this.queryForm, { 'queryMine': '' })
        } else if (this.choseStatus === 'two') {
          return Object.assign({}, this.queryForm, { 'approved': '' })
        } else if (this.choseStatus === 'three') {
          return Object.assign({}, this.queryForm, { 'waitPaying': '' })
        } else if (this.choseStatus === 'four') {
          return Object.assign({}, this.queryForm, { 'queryPaid': '' })
        } else if (this.choseStatus === 'six') {
          return Object.assign({}, this.queryForm, { 'queryFailed': '' })
        } else if (this.choseStatus === 'five') {
          return this.queryForm
        } else return this.queryForm
      }, // 判断当前选择器被选中的项
      statusChange(valId) {
        this.isGroup = valId === 1
        // console.log(this.isGroup)
      }, // 表单中申请类型选择器过滤
      /** 远程搜索类 */
      remoteSubject(query) {
        this.loading_search.subject = true
        let params = {}
        if (query.trim() !== '') {
          params = { name: query.trim() }
        }
        getSbjType(params).then(res => {
          this.sbjs = res.data
          this.loading_search.subject = false
        })
      }, // 远程搜索科目明细
      remoteCostUsers(query) {
        this.loading_search.cost_user = true
        this.loading_search.input_user = true
        let params = {}
        if (query.trim() !== '') {
          params = { name: query.trim() }
        }
        getUsers(params).then(res => {
          this.costUsers = res.data._items
          this.loading_search.cost_user = false
          this.loading_search.input_user = false
        })
      }, // 远程搜索用户
      remoteProjects(query) {
        this.loading_search.project = true
        let params = {}
        if (query.trim() !== '') {
          params = { name: query.trim() }
        }
        getProjects(params).then(res => {
          this.projects = res.data._items
          this.loading_search.project = false
        })
      }, // 远程搜索项目
      remoteGroups(query) {
        this.loading_search.group = true
        let params = {}
        if (query.trim() !== '') {
          params = { name: query.trim() }
        }
        getGroups(params).then(res => {
          this.groups = res.data._items
          this.loading_search.group = false
        })
      }, // 远程搜分组
      /** 分页器方法 */
      handleSizeChange(pageSize) {
        this.loading = true
        this.pageInfo.pageSize = pageSize
        getFinance(this.finalSearchForm).then(res => {
          this.applications = res.data._items
          this.pageInfo.totalCount = res.data._meta.totalCount
          this.loading = false
        })
      },
      handleCurrentChange(currentPage) {
        this.loading = true
        this.pageInfo.currentPage = currentPage
        getFinance(this.finalSearchForm).then(res => {
          this.applications = res.data._items
          this.pageInfo.totalCount = res.data._meta.totalCount
          this.loading = false
        })
      },
      /** 批量被选择 */
      handleSelectionChange(val) {
        this.multipleSelection = val
        const times = val.length
        this.sum = 0
        this.num = times
        for (let i = 0; i < times; i++) {
          this.sum = (Number(this.sum) * 100 + Number(val[i].money) * 100) / 100
        }
      },
      /** 排序 */
      handleSortChange({ column, prop, order }) {
        this.queryForm.sort_name = prop
        if (order === 'ascending') {
          this.queryForm.sort = 4
        } else if (order === 'descending') {
          this.queryForm.sort = 3
        }
        this.onQuery()
      }
    },
    mounted() {
      this.fetchUserConfig()
      this.fetchMine(this.finalSearchForm)
      this.fetchType()
      this.fetchSbjType()
      this.fetchGroups()
      this.fetchProjects()
    },
    computed: {
      finalSearchForm() {
        const res = Object.assign({}, this.selectChecked())
        res.pageSize = this.pageInfo.pageSize
        res.page = this.pageInfo.currentPage
        return res
      },
      branches() {
        return this.$store.state.user.branches
      },
      /** 特殊权限检查 */
      viewAccessCheck() {
        // 仅吴金娟/陈莉/唐总/管理员可视
        return this.$store.getters.userId === 145 || this.$store.getters.userId === 80 || this.$store.getters.userId === 45 || this.$store.getters.userId === 33
      }
    },
    beforeMount() {
      /**  页面权限检查 如无权限则跳转至404  */
      if (this.actionCheck_.actionCheck('read_Financial_pageApplyAll#') === false) {
        this.$message.error('错误提示: 您没有访问该页面的权限!')
        this.$router.push({ name: '404' })
      }
    }
  }
</script>

<style scoped>
  .my-table-applyAll{
    margin-left: 10px;
  }
  .apply-detail{
    height: 260px;
    background-color: floralwhite!important;
  }
  .tag{
    height: 26px;
    background-color: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
  }
  .app-container{
    padding-left: 0;
    padding-right: 0;
    padding-top: 0
  }
  .tips {
    color: #fff;
    font-size: small;
    font-family: Microsoft YaHei,serif;
    border-radius: 5px 5px 5px 5px;
    padding: 5px 10px;
    height: 25px;
    width: 72px;
    background-color: #55c51c;
  }
  .tips-text {
    color: #555c66;
    font-size: small;
    font-family: Microsoft YaHei,serif;
    padding: 5px;
  }
  .header{
    padding: 10px 10px 10px 10px;
    background-color: #ffffff;
    height: 40px;
  }
  .shrink-button{
    z-index: 100;
    float:right;
    margin-right: 200px;
    width: 200px;
  }
  .pass-button{
    padding: 5px 7px;
    margin-right: 1px;
    margin-left: 1px;
  }
  .header-font{
    color: rgb(96, 98, 102);
    display: inline-block;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    font-size: 14px;
    font-weight: bold;
    line-height: 40px;
    padding-right: 12px;
    text-align: right;
    text-rendering: optimizeLegibility;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    -moz-text-size-adjust: 100%;
  }
  .header-batch{
    color: #FFFFFF;
    display: inline-block;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    font-size: 14px;
    line-height: 40px;
    padding-right: 12px;
    text-align: right;
    text-rendering: optimizeLegibility;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    -moz-text-size-adjust: 100%;
  }
</style>
<style>
  .pagination .el-pagination__jump {
    margin-left: 24px;
    font-weight: 400;
    color: #ffffff!important;
  }
  .pagination .el-pagination__total {
    margin-right: 10px;
    font-weight: 400;
    color: #ffffff!important;
  }
  .my-table-applyAll .el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed {
    border-right: 2px solid #ebeef5!important;
  }
  .my-table-applyAll .el-table td, .el-table th.is-leaf {
    border-bottom: 2px solid #ebeef5!important;
  }
  .my-table-applyAll .el-table__expanded-cell[class*=cell] {
    padding: 10px 10px 10px 50px!important;
    background-color: floralwhite!important;
  }
  .my-table-applyAll .el-table__expand-icon {
    color: #fff!important;
  }
</style>
