<template>
  <div class="app-container">
    <!--头部部分-->
    <div class="header">
      <div v-if="showCheckbox">
        <!--温馨提示栏-->
        <el-row>
          <el-col :span="1.5" style="margin-top: 8px;margin-bottom: 5px">
            <div class="tips">温馨提示</div>
          </el-col>
          <el-col :span="18" style="margin-top: 8px;margin-bottom: 5px">
            <div class="tips-text"><b>本页默认展示我参与审批的申请!</b>
              1. 当申请金额<=3000元时,审批流程只有三级! 2. 在申请到达我所在的审批级时才能操作审批! 3. 财务审批和拨款处理在财务审批页面操作!
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
                  <el-button @click="onQuery()" size="small" style="width: 200px" icon="el-icon-search" type="primary">查询</el-button>
                  <el-button @click="onClearQuery()" size="small" style="width: 200px" icon="el-icon-search" type="primary">清空重置</el-button>
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
              <el-radio-button label="top">待我审批</el-radio-button>
              <el-radio-button label="right">我已审批</el-radio-button>
              <el-radio-button label="bottom" v-if="read_applyManage_All">全部申请</el-radio-button>
              <el-radio-button label="left" v-if="read_applyManage_Failed">失败申请</el-radio-button>
            </el-radio-group>
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
      <el-row>
        <!--表项显示/隐藏选择栏1-->
        <el-col>
          <div class="header-font" >表项显示</div>
          <el-checkbox size="mini" v-model="checkBox.showActualStatus" >实际状态</el-checkbox>
          <el-checkbox size="mini" v-model="checkBox.showReceipt_no" >报销单号</el-checkbox>
          <el-checkbox size="mini" v-model="checkBox.showProject" >所属项目/分组</el-checkbox>
          <el-checkbox size="mini" v-model="checkBox.showSbj" >面单科目</el-checkbox>
          <el-checkbox size="mini" v-model="checkBox.showSbjR" >实际科目</el-checkbox>
          <el-checkbox size="mini" v-model="checkBox.showInputUser" >申请人</el-checkbox>
          <el-checkbox size="mini" v-model="checkBox.showApplyType" >申请类型</el-checkbox>
          <el-checkbox size="mini" v-model="checkBox.showUse" >用途</el-checkbox>
          <el-checkbox size="mini" v-model="checkBox.showReason" >拒绝原因</el-checkbox>
          <el-checkbox size="mini" v-model="checkBox.showAction" >操作栏</el-checkbox>
        </el-col>
      </el-row>
      <el-row>
        <!--表项显示/隐藏选择栏2-->
        <el-col>
          <div class="header-font" >审批显示</div>
          <el-checkbox size="mini" v-model="checkBox.showApproved" >部门审批状态</el-checkbox>
          <el-checkbox size="mini" v-model="checkBox.showFinancial" >财务状态</el-checkbox>
          <el-checkbox size="mini" v-model="checkBox.showFirstTime" >一审时间</el-checkbox>
          <el-checkbox size="mini" v-model="checkBox.showSecondTime" >二审时间</el-checkbox>
          <el-checkbox size="mini" v-model="checkBox.showThirdTime" >三审时间</el-checkbox>
          <el-checkbox size="mini" v-model="checkBox.showFourthTime" >四审时间</el-checkbox>
          <el-checkbox size="mini" v-model="checkBox.showPassTime" >财务审批时间</el-checkbox>
          <el-checkbox size="mini" v-model="checkBox.showPayerTime" >打款时间</el-checkbox>
          <el-button @click="onRemember" type="primary" size="mini" style="margin-left: 15px;">记住我的选项</el-button>
        </el-col>
      </el-row>
      <!--批量操作栏-->
      <el-row style="background-color: rgb(107, 112, 115);border-radius:5px 5px;padding-left: 5px ">
        <!--批量操作按钮 批量统计金额-->
        <el-col :span="10">
          <div class="header-batch">批量操作：</div>
          <el-button-group>
            <el-button @click="onBatchPass" size="small" type="primary" icon="el-icon-success" v-if="num >= 1">批量通过</el-button>
            <el-button @click="onBatchRefuse" size="small" type="danger" icon="el-icon-error" v-if="num >= 1">批量拒绝</el-button>
          </el-button-group>
          <div class="header-batch" style="margin-left: 20px">已选中数：{{this.num}}</div>
          <div class="header-batch" style="margin-left: 40px">金额合计：{{this.sum}}</div>
        </el-col>
        <!--分页器-->
        <el-col :span="7">
          <div class="paginationStyle-00">
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageInfo.currentPage"
              :page-sizes="[10, 20, 50, 100, 200]"
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
        v-loading="loading" border :data="applications"
        id="apply-mineCost"
        :row-style="rowStyle" :cell-style="cellStyle"
        stripe fit
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange">
        <el-table-column align="center" type="selection" width="45"></el-table-column>
        <el-table-column fixed="left" type="expand" label="展开" width="50">
          <template slot-scope="props">
            <el-row class="apply-detail">
              <el-col :span="3">
                <el-form label-position="left" style="height: 20px;">
                  <el-form-item label="一级审批人" style="height: 20px">{{ props.row.first.name }}</el-form-item>
                  <el-form-item label="二级审批人" style="height: 20px">{{ props.row.second.name }}</el-form-item>
                  <el-form-item label="三级审批人" style="height: 20px">{{ props.row.third.name }}</el-form-item>
                  <el-form-item label="四级审批人" style="height: 20px" v-if="props.row.money > 3000" >{{ props.row.fourth.name}}</el-form-item>
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
                  <el-form-item label="报销备注" style="height: 300px">
                    <el-input style="width: 250px;height: 320px;padding-left: 5px;padding-right: 5px;margin-top: 5px;" readonly
                              type="textarea" :autosize="{ minRows: 4, maxRows: 4}" v-model="props.row.note">
                    </el-input>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="id" label="ID" width="65"></el-table-column>
        <el-table-column prop="date" label="申请日期" width="120" :formatter="dateFormat"></el-table-column>
        <el-table-column align="center" prop="note" label="实际状态" width="120" :formatter="getActualStatus" v-if="checkBox.showActualStatus"></el-table-column>
        <el-table-column label="报销单号________(条数)" width="250" v-if="checkBox.showReceipt_no">
          <template slot-scope="scope">
            <el-row>
              <el-col :span="15">
                {{scope.row.receipt_no}}
              </el-col>
              <el-col :span="8">
                <div style="text-align: right">(共{{scope.row.receipt_total===null?0:scope.row.receipt_total}}条)</div>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column prop="cost_user_name" label="报销人" width="90"></el-table-column>
        <el-table-column prop="input_user_name" label="申请人" width="90" v-if="checkBox.showInputUser"></el-table-column>
        <el-table-column prop="applyType_id" label="申请类型" :formatter="applyTypeFormat" width="100" v-if="checkBox.showApplyType"></el-table-column>
        <el-table-column prop="sbj_name" label="面单科目" width="180" v-if="checkBox.showSbj"></el-table-column>
        <el-table-column prop="sbjR_name" label="实际科目" width="180" v-if="checkBox.showSbjR"></el-table-column>
        <el-table-column label="项目/分组" width="350" v-if="checkBox.showProject">
          <template slot-scope="scope">
            <a style="width: 332px;padding-left: 5px;padding-right: 5px;margin-top: 15px;" v-if="scope.row.applyType_id===1">{{scope.row.group.name}}</a>
            <a style="width: 332px;padding-left: 5px;padding-right: 5px;margin-top: 15px;" v-if="scope.row.applyType_id!==1">{{scope.row.project.name}}</a>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="money" label="申请金额" width="120"></el-table-column>
        <el-table-column prop="use" label="用途" width="200" v-if="checkBox.showUse" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="note" label="备注" width="150" v-if="checkBox.showUse" :show-overflow-tooltip="true"></el-table-column>
        <!--<el-table-column prop="status" label="申请状态" :formatter="statusFormat"></el-table-column>-->
        <el-table-column align="center" label="一级审批" width="150" v-if="checkBox.showApproved">
          <template slot-scope="scope">
            <el-tag class="tag" :type="scope.row.firstStatus | approvalStatusFilter">{{scope.row.firstStatus | approvalStatus}}( {{ scope.row.first.name }} )</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="first_time" align="center" label="一级审批时间" sortable="custom" width="165" :formatter="dateFormat2" v-if="checkBox.showFirstTime"></el-table-column>
        <el-table-column align="center" label="二级审批" width="150" v-if="checkBox.showApproved">
          <template slot-scope="scope">
            <el-tag class="tag" :type="scope.row.secondStatus | approvalStatusFilter">{{scope.row.secondStatus | approvalStatus}}( {{ scope.row.second.name }} )</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="second_time" align="center" label="二级审批时间" sortable="custom" width="165" :formatter="dateFormat2" v-if="checkBox.showSecondTime"></el-table-column>
        <el-table-column align="center" label="三级审批" width="150" v-if="checkBox.showApproved">
          <template slot-scope="scope">
            <el-tag class="tag" :type="scope.row.thirdStatus | approvalStatusFilter">{{scope.row.thirdStatus | approvalStatus}}( {{ scope.row.third.name }} )</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="third_time" align="center" label="三级审批时间" sortable="custom" width="165" :formatter="dateFormat2" v-if="checkBox.showThirdTime"></el-table-column>
        <el-table-column align="center" label="四级审批" width="150" v-if="checkBox.showApproved">
          <template slot-scope="scope" v-if="scope.row.money > 3000">
            <el-tag class="tag" :type="scope.row.fourthStatus | approvalStatusFilter">{{scope.row.fourthStatus | approvalStatus}}( {{ scope.row.fourth.name }} )</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="fourth_time" align="center" label="四级审批时间" sortable="custom" width="165" :formatter="dateFormat2" v-if="checkBox.showFourthTime"></el-table-column>
        <el-table-column align="center" label="财务处理" width="150" v-if="checkBox.showFinancial">
          <template slot-scope="scope">
            <el-tag class="tag" :type="scope.row.financialStatus | financialStatusFilter">{{scope.row.financialStatus | approvalFinancialStatus}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="financial_time" align="center" label="财务审批时间" sortable="custom" width="165" :formatter="dateFormat2" v-if="checkBox.showPassTime"></el-table-column>
        <el-table-column prop="payer_time" align="center" label="财务打款时间" sortable="custom" width="165" :formatter="dateFormat2" v-if="checkBox.showPayerTime"></el-table-column>
        <el-table-column prop="comment" label="拒绝原因" width="200" v-if="checkBox.showReason"></el-table-column>
        <el-table-column width="160" fixed="left" label="操作栏" align="center" v-if="checkBox.showAction">
          <template slot-scope="scope">
              <el-button
                @click="onClickPass(scope.row)"
                :disabled="passDisabledFilter(scope.row)"
                :type="passTypeFilter(scope.row)"
                icon="el-icon-success"
                class="btn-pass"
                size="mini">{{passStatusFilter(scope.row)}}</el-button>
            <el-button
              @click="onClickRefuse(scope.row)"
              :disabled="refuseDisabledFilter(scope.row)"
              :type="refuseTypeFilter(scope.row)"
              icon="el-icon-error"
              class="btn-pass"
              size="mini">{{refuseStatusFilter(scope.row)}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<!--
    Permissions on this page:
    页面访问: read_applyManage_pageApplyAll   beforeMount()
    查看全部申请: read_applyManage_All         beforeMount()
    查看看失败申请: read_applyManage_Failed    beforeMount()
-->
<script>
  import { getApproved, passApply } from '../../../api/costApply'
  import { parseTime } from '../../../utils/index'
  import { getSbjType } from '../../../api/costBasic'
  import { getUsers } from '../../../api/user'
  import { getProjects } from '../../../api/project'
  import { getGroups } from '../../../api/costGeneral'
  import { getUserConfig, updateUserConfig } from '../../../api/userConfig'

  export default {
    name: 'applyAll',
    data() {
      return {
        // 数据源类 groups：全部分组 projects：全部项目 sbjs：全部科目明细 costUsers：全部员工 applications：全部申请
        groups: [],
        projects: [],
        sbjs: [],
        costUsers: [],
        applications: [],
        // 全局获取登录人ID
        myId: this.$store.getters.userId,
        showCheckbox: true, // 显示头部搜索组件
        updateForm: {
          id: null,
          financialStatus: null,
          firstStatus: null,
          secondStatus: null,
          thirdStatus: null,
          fourthStatus: null,
          comment: null
        },
        // 分页类
        pageInfo: {
          currentPage: 1,
          pageSize: 20,
          totalCount: 0
        },
        // 表格多选类 sum：金额合计 num： 选中合计 multipleSelection：被选中的项
        sum: 0,
        num: 0,
        multipleSelection: [],
        // 表格切换选择器当前选择项
        choseStatus: 'top',
        // 加载动画
        loading: false,
        // 查询请求表单
        queryForm: {
          id: null,
          start_at: null,
          end_at: null,
          pro_id: null,
          group_id: null,
          cost_user_id: null,
          input_user_id: null,
          date: [],
          sbj_id: null,
          sbjR_id: null,
          applyType_id: null,
          start_id: null,
          end_id: null,
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
          showActualStatus: true,
          showProject: true,
          showInputUser: false,
          showApplyType: true,
          showApproved: true,
          showAction: true,
          showSbj: false,
          showSbjR: true,
          showUse: true,
          showReason: true,
          showFirstTime: false,
          showSecondTime: false,
          showThirdTime: false,
          showFourthTime: false,
          showPassTime: false,
          showPayerTime: false,
          showFinancial: true,
          showReceipt_no: false
        },
        // 权限
        read_applyManage_All: false,
        read_applyManage_Failed: false
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
        const params = { costsManage_applyAll_tableShow: jsonStr }
        updateUserConfig(params).then(res => {
          if (res.data.bCode === 101) {
            this.$notify({ title: '成功', message: '已成功记住我的选择!', type: 'success', position: 'top-right' })
          } else {
            this.$notify({ title: '失败', message: res.data.bData, type: 'warning', position: 'top-right' })
          }
        })
      },
      onQuery() {
        // 判断选择器的选项
        this.loading = true
        getApproved(this.finalSearchForm).then(res => {
          this.applications = res.data._items
          this.pageInfo.totalCount = res.data._meta.totalCount
          this.loading = false
        })
      },
      onClearQuery() {
        this.queryForm = {
          id: null,
          start_at: null,
          end_at: null,
          pro_id: null,
          group_id: null,
          cost_user_id: null,
          input_user_id: null,
          date: [],
          sbj_id: null,
          sbjR_id: null,
          applyType_id: null,
          start_id: null,
          end_id: null,
          branch_id: null,
          sort: null,
          sort_name: null
        }
        this.onQuery()
      },
      onClickPass(row) {
        this.getPassStatus(row)
        this.myId = this.$store.getters.userId
        // 如果一级和二级审批人相同且都未审批,第三级审批人不同
        if (row.first_id === this.myId && row.second_id === this.myId && row.third_id !== this.myId && row.firstStatus === 0 && row.secondStatus === 0) {
          this.$confirm('您将同时审批一级和二级 , 并<a style="color: #3a8ee6">同意</a>该申请,' +
            '是否确认<a style="color: #3a8ee6">同意</a>?', '同意申请', {
            confirmButtonText: '确认同时审批',
            cancelButtonText: '我再想想',
            type: 'warning',
            center: true,
            dangerouslyUseHTMLString: true
          }).then(() => {
            this.updateForm.id = row.id
            this.updateForm.firstStatus = 1
            this.updateForm.secondStatus = 1
            passApply(this.updateForm).then(res => {
              this.choseStatus = 'top'
              this.fetchMineApproval(this.finalSearchForm)
            })
            this.$message({ type: 'success', message: '审批成功!' })
            this.resetForm()
          }).catch(() => {
            this.$message({ type: 'info', message: '已取消操作' })
            this.resetForm()
          })
          // 如果一级和二级和三级审批人相同且都未审批,
        } else if (row.first_id === this.myId && row.second_id === this.myId && row.third_id === this.myId && row.firstStatus === 0 && row.secondStatus === 0 && row.thirdStatus === 0) {
          this.$confirm('您将同时审批一级二级和三级 , 并<a style="color: #3a8ee6">同意</a>该申请,' +
            '是否确认<a style="color: #3a8ee6">同意</a>?', '同意申请', {
            confirmButtonText: '确认同时审批',
            cancelButtonText: '我再想想',
            type: 'warning',
            center: true,
            dangerouslyUseHTMLString: true
          }).then(() => {
            this.updateForm.id = row.id
            this.updateForm.firstStatus = 1
            this.updateForm.secondStatus = 1
            this.updateForm.thirdStatus = 1
            passApply(this.updateForm).then(res => {
              this.choseStatus = 'top'
              this.fetchMineApproval(this.finalSearchForm)
            })
            this.$message({ type: 'success', message: '审批成功!' })
            this.resetForm()
          }).catch(() => {
            this.$message({ type: 'info', message: '已取消操作' })
            this.resetForm()
          })
          // 如果二级和三级审批人相同且都未审批,且第一级审批人不同
        } else if (row.first_id !== this.myId && row.second_id === this.myId && row.third_id === this.myId && row.secondStatus === 0 && row.thirdStatus === 0) {
          this.$confirm('您将同时审批二级和三级 , 并<a style="color: #3a8ee6">同意</a>该申请,' +
            '是否确认<a style="color: #3a8ee6">同意</a>?', '同意申请', {
            confirmButtonText: '确认同时审批',
            cancelButtonText: '我再想想',
            type: 'warning',
            center: true,
            dangerouslyUseHTMLString: true
          }).then(() => {
            this.updateForm.id = row.id
            this.updateForm.secondStatus = 1
            this.updateForm.thirdStatus = 1
            passApply(this.updateForm).then(res => {
              this.choseStatus = 'top'
              this.fetchMineApproval(this.finalSearchForm)
            })
            this.$message({ type: 'success', message: '审批成功!' })
            this.resetForm()
          }).catch(() => {
            this.$message({ type: 'info', message: '已取消操作' })
            this.resetForm()
          })
          // 其他情况
        } else {
          this.$confirm('您将审批并<a style="color: #3a8ee6">同意</a>该申请,' +
            '是否确认<a style="color: #3a8ee6">同意</a>!', '同意申请', {
            confirmButtonText: '确认',
            cancelButtonText: '我再想想',
            type: 'warning',
            center: true,
            dangerouslyUseHTMLString: true
          }).then(() => {
            this.updateForm.id = row.id
            passApply(this.updateForm).then(res => {
              this.choseStatus = 'top'
              this.fetchMineApproval(this.finalSearchForm)
            })
            this.$message({ type: 'success', message: '审批成功!' })
            this.resetForm()
          }).catch(() => {
            this.$message({ type: 'info', message: '已取消操作' })
            this.resetForm()
          })
        }
      }, // 同意申请
      onClickRefuse(row) {
        this.getRefuseStatus(row)
        this.$prompt('将审批并<a style="color: darkred">拒绝</a>该申请,是否确认<a style="color: darkred">拒绝</a>?', '拒绝申请', {
          inputPlaceholder: '请填写拒绝原因!',
          confirmButtonText: '确认异常',
          cancelButtonText: '我再想想',
          type: 'error',
          center: true,
          dangerouslyUseHTMLString: true,
          inputValue: row.comment
        }).then(({ value }) => {
          this.updateForm.comment = value
          this.updateForm.id = row.id
          passApply(this.updateForm).then(res => {
            this.choseStatus = 'top'
            this.fetchMineApproval(this.finalSearchForm)
          })
          this.$message({ type: 'success', message: '拒绝成功!' })
          this.resetForm()
        }).catch(() => {
          this.$message({ type: 'info', message: '已取消操作' })
          this.resetForm()
        })
      }, // 拒绝申请
      onChangeChose() {
        this.loading = true
        if (this.choseStatus === 'top') this.fetchMineApproval(this.finalSearchForm)
        if (this.choseStatus === 'right') this.fetchMineApproved(this.finalSearchForm)
        if (this.choseStatus === 'bottom') this.fetchApply(this.finalSearchForm)
        if (this.choseStatus === 'left') this.fetchApplyFailed(this.finalSearchForm)
      }, // 选择器被选择
      onBatchPass() {
        // 1.检查是否超过10条
        if (this.num > 10) {
          this.$message({ type: 'error', message: '抱歉，批量审批最多不得超过10条！（如要修改限制，请联系管理员）' })
          return
        }
        // 2.循环遍历出被选择项id,将可以审批的id集合为ids,将无法审批的id集合为ids_，可以审批的申请总金额为sum
        let ids = ''
        let sum = 0
        let ids_ = ''
        const res = this.multipleSelection
        for (let i = 0; i < this.num; i++) {
          if (res[i].firstStatus === 0 && res[i].first_id === this.myId) {
            ids = res[i].id + ',' + ids
            sum += Number(res[i].money)
          } else if (res[i].firstStatus === 1 && res[i].secondStatus === 0 && res[i].second_id === this.myId) {
            ids = res[i].id + ',' + ids
            sum += Number(res[i].money)
          } else if (res[i].secondStatus === 1 && res[i].thirdStatus === 0 && res[i].third_id === this.myId) {
            ids = res[i].id + ',' + ids
            sum += Number(res[i].money)
          } else if (res[i].thirdStatus === 1 && res[i].fourthStatus === 0 && res[i].fourth_id === this.myId) {
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
          for (let i = 0; i < this.num; i++) {
            // 用短名称常量代替原数据
            const idM = this.myId
            const id1 = res[i].first_id
            const id2 = res[i].second_id
            const id3 = res[i].third_id
            const id4 = res[i].fourth_id
            const status1 = res[i].firstStatus
            const status2 = res[i].secondStatus
            const status3 = res[i].thirdStatus
            const status4 = res[i].fourthStatus
            // 判断1：一级待审且本人
            if (status1 === 0 && id1 === idM) {
              // 子判断1： 二级待审且本人，三级非本人
              if (id2 === idM && id3 !== idM && status2 === 0) {
                this.updateForm.firstStatus = 1
                this.updateForm.secondStatus = 1
              } else if (id2 === idM && id3 === idM && status2 === 0 && status3 === 0) {
                // 子判断2： 二级三级待审且本人
                this.updateForm.firstStatus = 1
                this.updateForm.secondStatus = 1
                this.updateForm.thirdStatus = 1
              } else this.updateForm.firstStatus = 1 // 其他情况即仅审批一级
            }
            // 判断2：一级已审，二级待审且本人
            if (status1 === 1 && status2 === 0 && id2 === idM) {
              // 子判断1： 三级待审且本人
              if (id3 === idM && status3 === 0) {
                this.updateForm.secondStatus = 1
                this.updateForm.thirdStatus = 1
              } else this.updateForm.secondStatus = 1 // 其他情况即仅审批二级
            }
            // 判断3：二级已审，三级待审且本人
            if (status2 === 1 && status3 === 0 && id3 === idM) { this.updateForm.thirdStatus = 1 }
            // 判断4：三级已审，四级待审且本人
            if (status3 === 1 && status4 === 0 && id4 === idM) { this.updateForm.fourthStatus = 1 }
            // 填充被审ID
            this.updateForm.id = res[i].id
            // 进行提交
            passApply(this.updateForm).then(res => {
              this.choseStatus = 'top'
              this.fetchMineApproval(this.finalSearchForm)
            })
            this.resetForm()
          }
          this.$message({ type: 'success', message: '批量审批成功!' })
        }).catch(() => {
          this.$message({ type: 'info', message: '取消操作' })
        })
      },
      onBatchRefuse() {
        this.$message({ type: 'error', message: '抱歉，考虑到无法填写拒绝原因，暂不支持批量拒绝!' })
      },
      /** -------- 接口获取类 -------- */
      fetchApply(params) {
        this.loading = true
        getApproved(params).then(res => {
          this.applications = res.data._items
          this.pageInfo.totalCount = res.data._meta.totalCount
          this.loading = false
        })
      }, // 获取所有申请记录
      fetchMineApproval(params) {
        this.loading = true
        const res = Object.assign({}, params, { 'queryMine': '' })
        getApproved(res).then(res => {
          this.applications = res.data._items
          this.pageInfo.totalCount = res.data._meta.totalCount
          this.loading = false
        })
      }, // 获取待我审批的申请
      fetchMineApproved(params) {
        this.loading = true
        const res = Object.assign({}, params, { 'approved': '' })
        getApproved(res).then(res => {
          this.applications = res.data._items
          this.pageInfo.totalCount = res.data._meta.totalCount
          this.loading = false
        })
      }, // 获取我已审批的申请
      fetchApplyFailed(params) {
        this.loading = true
        const res = Object.assign({}, params, { 'failedType': '' })
        getApproved(res).then(res => {
          this.applications = res.data._items
          this.pageInfo.totalCount = res.data._meta.totalCount
          this.loading = false
        })
      }, // 获取所有失败的申请
      fetchUserConfig() {
        getUserConfig().then(res => {
          if (res.data.costsManage_applyAll_tableShow !== null) {
            this.$notify({ title: '已读取云端配置', message: '已读取您记住的选项!', type: 'success', position: 'top-right' })
            const jsObject = JSON.parse(res.data.costsManage_applyAll_tableShow)
            this.checkBox = Object.assign({}, jsObject)
          } else {
            console.log('读取失败,可能是用户未保存选项')
          }
        })
      }, // 读取用户保存的表项显示配置项
      /** -------- 表单处理类 --------- */
      resetForm() {
        this.updateForm = {
          id: null,
          firstStatus: null,
          secondStatus: null,
          thirdStatus: null,
          fourthStatus: null,
          comment: null,
          branch_id: null
        }
      },
      /** -------- 表格样式类 -------- */
      rowStyle() {
        return 'height: 25px'
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
      passStatusFilter(row) {
        this.myId = this.$store.getters.userId
        if (row.firstStatus === 0 && row.first_id === this.myId) {
          return '同意'
        } else if (row.secondStatus === 0 && row.second_id === this.myId && row.firstStatus === 1) {
          return '同意'
        } else if (row.thirdStatus === 0 && row.third_id === this.myId && row.secondStatus === 1) {
          return '同意'
        } else if (row.fourthStatus === 0 && row.fourth_id === this.myId && row.thirdStatus === 1) {
          return '同意'
        } else return '暂无'
      }, // 同意按钮的操作按钮文字过滤器
      passTypeFilter(row) {
        this.myId = this.$store.getters.userId
        if (row.firstStatus === 0 && row.first_id === this.myId) {
          return 'primary'
        } else if (row.secondStatus === 0 && row.second_id === this.myId && row.firstStatus === 1) {
          return 'primary'
        } else if (row.thirdStatus === 0 && row.third_id === this.myId && row.secondStatus === 1) {
          return 'primary'
        } else if (row.fourthStatus === 0 && row.fourth_id === this.myId && row.thirdStatus === 1) {
          return 'primary'
        } else return ''
      }, // 同意按钮的操作按钮type过滤器
      passDisabledFilter(row) {
        this.myId = this.$store.getters.userId
        if (row.firstStatus === 0 && row.first_id === this.myId) {
          return false
        } else if (row.secondStatus === 0 && row.second_id === this.myId && row.firstStatus === 1) {
          return false
        } else if (row.thirdStatus === 0 && row.third_id === this.myId && row.secondStatus === 1) {
          return false
        } else return !(row.fourthStatus === 0 && row.fourth_id === this.myId && row.thirdStatus === 1)
      }, // 同意按钮的禁止属性过滤器
      refuseStatusFilter(row) {
        this.myId = this.$store.getters.userId
        if (row.firstStatus === 0 && row.first_id === this.myId) {
          return '拒绝'
        } else if (row.secondStatus === 0 && row.second_id === this.myId && row.firstStatus === 1) {
          return '拒绝'
        } else if (row.thirdStatus === 0 && row.third_id === this.myId && row.secondStatus === 1) {
          return '拒绝'
        } else if (row.fourthStatus === 0 && row.fourth_id === this.myId && row.thirdStatus === 1) {
          return '拒绝'
        } else return '暂无'
      }, // 拒绝按钮的操作按钮文字过滤器
      refuseTypeFilter(row) {
        this.myId = this.$store.getters.userId
        if (row.firstStatus === 0 && row.first_id === this.myId) {
          return 'danger'
        } else if (row.secondStatus === 0 && row.second_id === this.myId && row.firstStatus === 1) {
          return 'danger'
        } else if (row.thirdStatus === 0 && row.third_id === this.myId && row.secondStatus === 1) {
          return 'danger'
        } else if (row.fourthStatus === 0 && row.fourth_id === this.myId && row.thirdStatus === 1) {
          return 'danger'
        } else return ''
      }, // 拒绝按钮的操作按钮type过滤器
      refuseDisabledFilter(row) {
        this.myId = this.$store.getters.userId
        if (row.firstStatus === 0 && row.first_id === this.myId) {
          return false
        } else if (row.secondStatus === 0 && row.second_id === this.myId && row.firstStatus === 1) {
          return false
        } else if (row.thirdStatus === 0 && row.third_id === this.myId && row.secondStatus === 1) {
          return false
        } else return !(row.fourthStatus === 0 && row.fourth_id === this.myId && row.thirdStatus === 1)
      }, // 拒绝按钮的禁止属性过滤器
      getPassStatus(row) {
        this.myId = this.$store.getters.userId
        if (row.firstStatus === 0 && row.first_id === this.myId) {
          this.updateForm.firstStatus = 1
        } else if (row.secondStatus === 0 && row.second_id === this.myId && row.firstStatus === 1) {
          this.updateForm.secondStatus = 1
        } else if (row.thirdStatus === 0 && row.third_id === this.myId && row.secondStatus === 1) {
          this.updateForm.thirdStatus = 1
        } else if (row.fourthStatus === 0 && row.fourth_id === this.myId && row.thirdStatus === 1) {
          this.updateForm.fourthStatus = 1
        }
      }, // 获取需要通过审批的那一级状态
      getRefuseStatus(row) {
        this.myId = this.$store.getters.userId
        if (row.firstStatus === 0 && row.first_id === this.myId) {
          this.updateForm.firstStatus = 2
        } else if (row.secondStatus === 0 && row.second_id === this.myId && row.firstStatus === 1) {
          this.updateForm.secondStatus = 2
        } else if (row.thirdStatus === 0 && row.third_id === this.myId && row.secondStatus === 1) {
          this.updateForm.thirdStatus = 2
        } else if (row.fourthStatus === 0 && row.fourth_id === this.myId && row.thirdStatus === 1) {
          this.updateForm.fourthStatus = 2
        }
      }, // 获取需要拒绝审批的那一级状态
      selectChecked() {
        if (this.queryForm.date.length > 0) {
          this.queryForm.start_at = this.queryForm.date[0]
          this.queryForm.end_at = this.queryForm.date[1]
        }
        // 判断选择器的选项
        if (this.choseStatus === 'top') {
          return Object.assign({}, this.queryForm, { 'queryMine': '' })
        } else if (this.choseStatus === 'right') {
          return Object.assign({}, this.queryForm, { 'approved': '' })
        } else if (this.choseStatus === 'bottom') {
          return Object.assign({}, this.queryForm)
        } else if (this.choseStatus === 'left') {
          return Object.assign({}, this.queryForm, { 'failedType': '' })
        } else return this.queryForm
      }, // 根据选择器判断当前显示的类型
      getActualStatus(row, column) {
        if (row.note !== null) {
          const x = row.note.indexOf('实际已付款') > -1
          if (x === true) return '实际已付款'
          else return '-'
        } else return '-'
      },
      /** 远程搜索类 */
      remoteSubject(query) {
        let params = {}
        if (query.trim() !== '') {
          params = { name: query.trim() }
        }
        getSbjType(params).then(res => {
          this.sbjs = res.data
        })
      }, // 远程搜索科目明细
      remoteCostUsers(query) {
        let params = {}
        if (query.trim() !== '') {
          params = { name: query.trim() }
        }
        getUsers(params).then(res => {
          this.costUsers = res.data._items
        })
      }, // 远程搜索用户
      remoteProjects(query) {
        let params = {}
        if (query.trim() !== '') {
          params = { name: query.trim() }
        }
        getProjects(params).then(res => {
          this.projects = res.data._items
        })
      }, // 远程搜索项目
      remoteGroups(query) {
        let params = {}
        if (query.trim() !== '') {
          params = { name: query.trim() }
        }
        getGroups(params).then(res => {
          this.groups = res.data._items
        })
      }, // 远程搜分组
      /** 分页器方法 */
      handleSizeChange(pageSize) {
        this.loading = true
        this.pageInfo.pageSize = pageSize
        getApproved(this.finalSearchForm).then(res => {
          this.applications = res.data._items
          this.pageInfo.totalCount = res.data._meta.totalCount
          this.loading = false
        })
      },
      handleCurrentChange(currentPage) {
        this.loading = true
        this.pageInfo.currentPage = currentPage
        getApproved(this.finalSearchForm).then(res => {
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
        console.log()
        for (let i = 0; i < times; i++) {
          this.sum = ((Number(this.sum) * 100 + Number(val[i].money) * 100) / 100).toFixed(2)
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
      this.fetchMineApproval(this.finalSearchForm)
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
      }
    },
    beforeMount() {
      /**  页面权限检查 如无权限则跳转至404  */
      if (this.actionCheck_.actionCheck('read_applyManage_pageApplyAll#') === false) {
        this.$message.error('错误提示: 您没有访问该页面的权限!')
        this.$router.push({ name: '404' })
      }
      if (this.actionCheck_.actionCheck('read_applyManage_All#') === true) {
        this.read_applyManage_All = true
      }
      if (this.actionCheck_.actionCheck('read_applyManage_Failed#') === true) {
        this.read_applyManage_Failed = true
      }
    }
  }
</script>

<style scoped>
  .my-table-applyAll{
    margin-left: 10px;
  }
  .apply-detail{
      background-color: floralwhite!important;
      height: 260px;
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
  .shrink-button{
    z-index: 100;
    float:right;
    margin-right: 200px;
    width: 200px;
  }
  .paginationStyle-00{
    margin-top: 5px;
  }
  .btn-pass{
    padding: 5px;
    margin-top: 3px;
    margin-bottom: 3px;
  }
</style>
<style>
  .paginationStyle-00 .el-pagination__jump {
    margin-left: 24px;
    font-weight: 400;
    color: #ffffff!important;
  }
  .paginationStyle-00 .el-pagination__total {
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
