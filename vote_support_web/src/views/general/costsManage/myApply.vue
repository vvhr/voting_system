<template>
    <div class="app-container">
      <!--头部部分-->
      <div class="header">
        <el-form :inline="true">
          <el-row>
            <el-col :span="10">
              <el-form-item label="选择创建方式">
                <el-button @click="onCreateApply" style="margin: 1px" size="small" type="primary" icon="el-icon-plus">创建单条</el-button>
                <el-button @click="onCreateCostForm" style="margin: 1px" size="small" type="success" icon="el-icon-plus">创建报销单(推荐)</el-button>
                <el-button @click="onCreateExcel" style="margin: 1px" size="small" type="danger" icon="el-icon-upload2">批量导入</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="100px" label="筛选申请状态">
                <el-select size="small" v-model="searchForm.status" placeholder="选择申请状态">
                  <el-option
                    v-for="item in status"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-button size="small" style="margin-top: 3px" @click="onClickSearch" type="primary" icon="el-icon-search">搜索</el-button>
              <el-button size="small" @click="onClickShowCancel" type="primary" icon="el-icon-search">查看已取消申请</el-button>
            </el-col>
          </el-row>
          <el-row style="margin-bottom: 20px" v-if="user_department_id === 54 || $store.getters.userId === 33">
            <el-form-item label="财务专用操作">
              <el-button @click="onCreateApply_" style="margin: 1px" size="small" type="primary" icon="el-icon-plus">创建单条(财务账专用)</el-button>
              <el-button @click="onCreateExcel_" style="margin: 1px" size="small" type="danger" icon="el-icon-upload2">批量导入(财务账专用)</el-button>
              <el-button @click="onCreateLoan" style="margin: 1px" size="small" type="primary" icon="el-icon-plus">补录应收账</el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
      <!--表格部分-->
      <el-tabs type="border-card">
        <el-tab-pane label="我自己的报销申请">
          <div class="body-left">
            <!--分页器-->
            <div class="block" align="center">
              <el-popover class="popover" placement="bottom" title="我自己的报销申请" width="200" trigger="hover">
                本表格显示报销人为<a style="color: #1e6abc">{{$store.getters.name}}</a>的申请
                <el-button @click="onClickSearch" class="popoverBtn" slot="reference">我自己的报销申请</el-button>
              </el-popover>
              <el-pagination
                @size-change="handleSizeChange_left"
                @current-change="handleCurrentChange_left"
                :current-page="pageInfo_left.currentPage"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pageInfo_left.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pageInfo_left.totalCount">
              </el-pagination>
            </div>
            <el-table border :data="mineCost" id="apply-mineCost" :row-style="rowStyle" :cell-style="cellStyle" stripe>
              <el-table-column type="expand" label="详情" width="50">
                <template slot-scope="props">
                  <el-row :gutter="22">
                    <el-col :span="16">
                      <el-form label-position="left" inline style="height: 30px;">
                        <el-form-item label="本申请的有效状态">{{ props.row.valid | validStatusFormat}}</el-form-item>
                      </el-form>
                      <el-form label-position="left" inline style="height: 30px;">
                        <el-form-item label="报销人">{{ props.row.cost_user_name}}</el-form-item>
                        <el-form-item label="申请人">{{ props.row.input_user_name }}</el-form-item>
                      </el-form>
                      <el-form label-position="left" inline style="height: 30px;">
                        <el-form-item label="报销单号">{{ props.row.receipt_no }}</el-form-item>
                      </el-form>
                      <el-form label-position="left" inline style="height: 30px;">
                        <el-form-item label="申请类型">{{ props.row.applyType_id | applyTypeFormat}}</el-form-item>
                        <el-form-item label="报销类型">{{ props.row.type_name }}</el-form-item>
                      </el-form>
                      <el-form label-position="left" inline style="height: 30px;">
                        <el-form-item label="面单科目">{{ props.row.sbj_name }}</el-form-item>
                        <el-form-item label="实际科目">{{ props.row.sbjR_name }}</el-form-item>
                      </el-form>
                      <el-form label-position="left" inline style="height: 110px;">
                        <el-form-item label="所属分组" v-if="props.row.applyType_id === 1">
                          <el-input style="width: 332px;padding-left: 5px;padding-right: 5px;margin-top: 15px;" readonly
                                    type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="props.row.group.name">
                          </el-input>
                        </el-form-item>
                        <el-form-item label="所属项目" v-if="props.row.applyType_id !== 1">
                          <el-input style="width: 332px;padding-left: 5px;padding-right: 5px;margin-top: 15px;" readonly
                                    type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="props.row.project.name">
                          </el-input>
                        </el-form-item>
                      </el-form>
                      <el-form label-position="left" inline style="height: 110px">
                        <el-form-item label="用途">
                          <el-input style="width: 332px;padding-left: 5px;padding-right: 5px;margin-top: 15px;" readonly
                                    type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="props.row.use">
                          </el-input>
                        </el-form-item>
                      </el-form>
                      <el-form label-position="left" inline style="height: 110px">
                        <el-form-item label="备注">
                          <el-input style="width: 332px;padding-left: 5px;padding-right: 5px;margin-top: 15px;" readonly
                                    type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="props.row.note">
                          </el-input>
                        </el-form-item>
                      </el-form>
                    </el-col>
                    <el-col :span="6">
                      <div style="height: 350px;">
                        <el-steps direction="vertical" :active="activeStatusFilters(props.row)" finish-status="success" process-status="process">
                          <el-step>
                            <div slot="title">{{ props.row.firstStatus | approvalStatus}}</div>
                            <div slot="description">一级审批 {{ props.row.first.name }}</div>
                          </el-step>
                          <el-step>
                            <div slot="title">{{ props.row.secondStatus | approvalStatus }}</div>
                            <div slot="description">二级审批 {{ props.row.second.name }}</div>
                          </el-step>
                          <el-step>
                            <div slot="title">{{ props.row.thirdStatus | approvalStatus}}</div>
                            <div slot="description">三级审批 {{ props.row.third.name }}</div>
                          </el-step>
                          <el-step v-if="props.row.money > 3000">
                            <div slot="title">{{ props.row.fourthStatus | approvalStatus}}</div>
                            <div slot="description">四级审批 {{ props.row.fourth.name}}</div>
                          </el-step>
                          <el-step>
                            <div slot="title">{{ props.row.financialStatus | approvalFinancialStatus}}</div>
                            <div slot="description">财务处理 </div>
                          </el-step>
                        </el-steps>
                        <div style="margin-top: 5px">申请失败原因: {{ props.row.comment }}</div>
                      </div>
                    </el-col>
                  </el-row>
                </template>
              </el-table-column>
              <el-table-column prop="id" label="ID" width="50"></el-table-column>
              <el-table-column label="有效性" width="120">
                <template slot-scope="scope">
                  {{ scope.row.valid | validStatusFormat}}
                </template>
              </el-table-column>
              <el-table-column prop="date" label="申请日期" width="120" :formatter="dateFormat"></el-table-column>
              <el-table-column label="报销单号________(条数)" width="180">
                <template slot-scope="scope">
                  <el-row>
                      {{scope.row.receipt_no}}
                      <a style="text-align: right;font-size: 10px">(共{{scope.row.receipt_total===null?0:scope.row.receipt_total}}条)</a>
                  </el-row>
                </template>
              </el-table-column>
              <el-table-column prop="cost_user_name" label="报销人" ></el-table-column>
              <el-table-column prop="input_user_name" label="申请人" ></el-table-column>
              <el-table-column label="项目/分组" width="350">
                <template slot-scope="scope">
                  <a style="width: 332px;padding-left: 5px;padding-right: 5px;margin-top: 15px;" v-if="scope.row.applyType_id===1">{{scope.row.group.name}}</a>
                  <a style="width: 332px;padding-left: 5px;padding-right: 5px;margin-top: 15px;" v-if="scope.row.applyType_id!==1">{{scope.row.project.name}}</a>
                </template>
              </el-table-column>
              <el-table-column prop="applyType_id" label="申请类型" :formatter="applyTypeFormat" width="100"></el-table-column>
              <el-table-column prop="money" label="申请金额" width="120"></el-table-column>
              <el-table-column prop="status" label="申请状态" :formatter="statusFormat"></el-table-column>
              <el-table-column prop="payer_time" label="打款日期" width="120" :formatter="dateFormat"></el-table-column>
              <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                  <el-button v-if="scope.row.firstStatus === 0 && scope.row.valid === 1 " @click="onUpdateApply(scope.row)" type="warning" class="btnUpdate" icon="el-icon-edit" size="mini">修改</el-button>
                  <el-button v-if="scope.row.firstStatus === 0 && scope.row.valid === 1 " @click="onDeleteApply(scope.row)" type="danger" class="btnUpdate" icon="el-icon-remove" size="mini">撤回</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="我为员工创建的申请">
          <div class="body-left">
          <!--分页器-->
          <div class="block" align="center">
            <el-popover class="popover" placement="bottom" title="我为员工创建的申请" width="200" trigger="hover">
              本表格显示申请人为<a style="color: #1e6abc">{{$store.getters.name}}</a>,但报销人不为<a style="color: #1e6abc">{{$store.getters.name}}</a>的申请
              <el-button @click="onClickSearch" class="popoverBtn" slot="reference">我为员工创建的申请</el-button>
            </el-popover>
            <el-pagination
              @size-change="handleSizeChange_right"
              @current-change="handleCurrentChange_right"
              :current-page="pageInfo_right.currentPage"
              :page-sizes="[2, 20, 50, 100]"
              :page-size="pageInfo_right.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pageInfo_right.totalCount">
            </el-pagination>
          </div>
          <el-table border :data="mineInput" id="apply-mineInput" :row-style="rowStyle" :cell-style="cellStyle" stripe>
            <el-table-column type="expand" label="详情" width="50">
              <template slot-scope="props">
                <el-row :gutter="22">
                  <el-col :span="16">
                    <el-form label-position="left" inline style="height: 30px;">
                      <el-form-item label="本申请的有效状态">{{ props.row.valid | validStatusFormat}}</el-form-item>
                    </el-form>
                    <el-form label-position="left" inline style="height: 30px;">
                      <el-form-item label="报销单号">{{ props.row.receipt_no }}</el-form-item>
                    </el-form>
                    <el-form label-position="left" inline style="height: 30px;">
                      <el-form-item label="报销人">{{ props.row.cost_user_name}}</el-form-item>
                      <el-form-item label="申请人">{{ props.row.input_user_name }}</el-form-item>
                    </el-form>
                    <el-form label-position="left" inline style="height: 30px;">
                      <el-form-item label="申请类型">{{ props.row.applyType_id | applyTypeFormat}}</el-form-item>
                      <el-form-item label="报销类型">{{ props.row.type_name }}</el-form-item>
                    </el-form>
                    <el-form label-position="left" inline style="height: 30px;">
                      <el-form-item label="面单科目">{{ props.row.sbj_name }}</el-form-item>
                      <el-form-item label="实际科目">{{ props.row.sbjR_name }}</el-form-item>
                    </el-form>
                    <el-form label-position="left" inline style="height: 110px;">
                      <el-form-item label="所属分组" v-if="props.row.applyType_id === 1">
                        <el-input style="width: 332px;padding-left: 5px;padding-right: 5px;margin-top: 15px;" readonly
                                  type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="props.row.group.name">
                        </el-input>
                      </el-form-item>
                      <el-form-item label="所属项目" v-if="props.row.applyType_id !== 1">
                        <el-input style="width: 332px;padding-left: 5px;padding-right: 5px;margin-top: 15px;" readonly
                                  type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="props.row.project.name">
                        </el-input>
                      </el-form-item>
                    </el-form>
                    <el-form label-position="left" inline style="height: 110px">
                      <el-form-item label="用途">
                        <el-input style="width: 332px;padding-left: 5px;padding-right: 5px;margin-top: 15px;" readonly
                                  type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="props.row.use">
                        </el-input>
                      </el-form-item>
                    </el-form>
                    <el-form label-position="left" inline style="height: 110px">
                      <el-form-item label="备注">
                        <el-input style="width: 332px;padding-left: 5px;padding-right: 5px;margin-top: 15px;" readonly
                                  type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="props.row.note">
                        </el-input>
                      </el-form-item>
                    </el-form>
                  </el-col>
                  <el-col :span="6">
                    <div style="height: 350px;">
                      <el-steps direction="vertical" :active="activeStatusFilters(props.row)" finish-status="success" process-status="process">
                        <el-step>
                          <div slot="title">{{ props.row.firstStatus | approvalStatus}}</div>
                          <div slot="description">一级审批 {{ props.row.first.name }}</div>
                        </el-step>
                        <el-step>
                          <div slot="title">{{ props.row.secondStatus | approvalStatus }}</div>
                          <div slot="description">二级审批 {{ props.row.second.name }}</div>
                        </el-step>
                        <el-step>
                          <div slot="title">{{ props.row.thirdStatus | approvalStatus}}</div>
                          <div slot="description">三级审批 {{ props.row.third.name }}</div>
                        </el-step>
                        <el-step v-if="props.row.money > 3000">
                          <div slot="title">{{ props.row.fourthStatus | approvalStatus}}</div>
                          <div slot="description">四级审批 {{ props.row.fourth.name}}</div>
                        </el-step>
                        <el-step>
                          <div slot="title">{{ props.row.financialStatus | approvalFinancialStatus}}</div>
                          <div slot="description">财务处理 {{ props.row.comment }}</div>
                        </el-step>
                      </el-steps>
                      <div style="margin-top: 5px">申请失败原因: {{ props.row.comment }}</div>
                    </div>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
            <el-table-column prop="id" label="ID" width="50"></el-table-column>
            <el-table-column label="有效性" width="120">
              <template slot-scope="scope">
                {{ scope.row.valid | validStatusFormat}}
              </template>
            </el-table-column>
            <el-table-column prop="date" label="申请日期" width="120" :formatter="dateFormat"></el-table-column>
            <el-table-column label="报销单号________(条数)" width="180">
              <template slot-scope="scope">
                <el-row>
                  {{scope.row.receipt_no}}
                  <a style="text-align: right;font-size: 10px">(共{{scope.row.receipt_total===null?0:scope.row.receipt_total}}条)</a>
                </el-row>
              </template>
            </el-table-column>
            <el-table-column prop="cost_user_name" label="报销人" ></el-table-column>
            <el-table-column prop="input_user_name" label="申请人" ></el-table-column>
            <el-table-column label="项目/分组" width="350">
              <template slot-scope="scope">
                <a style="width: 332px;padding-left: 5px;padding-right: 5px;margin-top: 15px;" v-if="scope.row.applyType_id===1">{{scope.row.group.name}}</a>
                <a style="width: 332px;padding-left: 5px;padding-right: 5px;margin-top: 15px;" v-if="scope.row.applyType_id!==1">{{scope.row.project.name}}</a>
              </template>
            </el-table-column>
            <el-table-column prop="applyType_id" label="申请类型" :formatter="applyTypeFormat" width="100"></el-table-column>
            <el-table-column prop="money" label="申请金额" width="120"></el-table-column>
            <el-table-column prop="status" label="申请状态" :formatter="statusFormat"></el-table-column>
            <el-table-column prop="payer_time" label="打款日期" width="120" :formatter="dateFormat"></el-table-column>
            <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <el-button v-if="scope.row.firstStatus === 0 && scope.row.valid === 1 " @click="onUpdateApply(scope.row)" type="warning" class="btnUpdate" icon="el-icon-edit" size="mini">修改</el-button>
                <el-button v-if="scope.row.firstStatus === 0 && scope.row.valid === 1 " @click="onDeleteApply(scope.row)" type="danger" class="btnUpdate" icon="el-icon-remove" size="mini">撤回</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        </el-tab-pane>
      </el-tabs>
      <!--表单部分-->
      <div class="myApply">
        <!--// 创建申请表单-->
        <el-dialog title="创建申请" :visible.sync="visible.addForm" style="width: 1500px">
          <el-form :rules="rules" :model="addForm" ref="addForm" label-width="100px" size="mini">
              <el-form-item label="面单日期" prop="date">
                <el-date-picker v-model="addForm.date" value-format="timestamp" type="date" placeholder="选择日期"></el-date-picker>
              </el-form-item>
            <el-row>
              <el-col :span="10"><el-form-item label="报销人" prop="cost_user_id">
                  <el-select
                    style="width: 180px"
                    v-model="addForm.cost_user_id"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请选择"
                    :remote-method="remoteUsers">
                    <el-option v-for="user in users" :key="user.id" :label="user.name" :value="user.id"></el-option>
                  </el-select>
                </el-form-item></el-col>
              <el-col :span="6"><el-form-item label="申请人" prop="input_user_id">
                <el-input style="width: 180px" v-model="addForm.input_user_id" :disabled="true"></el-input>
              </el-form-item></el-col>
            </el-row>
              <el-form-item label="申请类型" prop="applyType_id">
                <el-select v-model="addForm.applyType_id" filterable placeholder="请选择申请类型" @change="statusChange(addForm.applyType_id)">
                  <el-option v-for="applyType in applyTypes" :key="applyType.id" :label="applyType.name" :value="applyType.id"></el-option>
                </el-select>
              </el-form-item>
            <el-row>
              <el-form-item label="所属项目" prop="pro_id" v-if="isGroup === false">
              <el-select
                :loading="input_on_loading"
                v-model="addForm.pro_id"
                filterable
                remote
                reserve-keyword
                placeholder="关键词搜索，空格表示全部"
                :remote-method="remoteProjects"
                style="width: 500px">
                <el-option v-for="pro in pros" :key="pro.id" :label="pro.name" :value="pro.id"></el-option>
              </el-select>
            </el-form-item>
              <el-form-item label="所属分组" prop="group_id" v-if="isGroup === true">
                <el-select
                  :loading="input_on_loading"
                  v-model="addForm.group_id"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="关键词搜索，空格表示全部"
                  :remote-method="remoteGroups"
                  style="width: 500px">
                  <el-option v-for="group in groups" :key="group.id" :label="group.name" :value="group.id"></el-option>
                </el-select>
              </el-form-item>
            </el-row>
              <el-form-item label="报销类型" prop="type_id">
                <el-select v-model="addForm.type_id" placeholder="请选择">
                  <el-option v-for="type in types" :key="type.id" :label="type.name" :value="type.id"></el-option>
                </el-select>
              </el-form-item>
            <el-row>
              <el-col :span="10">
                <el-form-item label="面单科目" prop="sbj_id">
                <el-select v-model="addForm.sbj_id" placeholder="请选择">
                  <el-option v-for="sbj in sbjs" :key="sbj.id" :label="sbj.name" :value="sbj.id"></el-option>
                </el-select>
              </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="实际科目" prop="sbjR_id">
                <el-select v-model="addForm.sbjR_id" placeholder="请选择">
                  <el-option v-for="sbj in sbjs" :key="sbj.id" :label="sbj.name" :value="sbj.id"></el-option>
                </el-select>
              </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="金额" prop="money">
              <el-input style="width: 150px" v-model="addForm.money" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="实际状态">
              若本申请财务实际已付款,请备注 <el-button type="primary" plain @click="onClickActualPaid"> 实际已付款 </el-button>
            </el-form-item>
            <el-form-item label="用途" prop="use">
              <el-input type="textarea" autosize style="width: 300px" v-model="addForm.use" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="note">
              <el-input type="textarea" autosize style="width: 300px" v-model="addForm.note" auto-complete="off"></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="10">
                <el-form-item label="报销单号" prop="receipt_no">
                  <el-input autosize style="width: 180px" v-model="addForm.receipt_no" placeholder="根据规则命名报销单号！"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="申请总条数" prop="receipt_total">
                  <el-input autosize style="width: 180px" v-model="addForm.receipt_total" placeholder="所属报销单下申请总条数！"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="操作栏" >
              <el-button type="primary" @click="submitAddForm('addForm')">确定申请</el-button>
              <el-button @click="visible.addForm = false">取 消</el-button>
              <el-button @click="resetForm('addForm')">重置填写</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <!--// 修改申请表单-->
        <el-dialog title="修改申请" :visible.sync="visible.updateForm" style="width: 1500px">
          <el-form :rules="rules" :model="updateForm" ref="updateForm" label-width="100px" size="mini">
            <el-form-item label="日期" prop="date">
              <el-date-picker v-model="updateForm.date" value-format="timestamp" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
            <el-row>
              <el-col :span="10"><el-form-item label="报销人" prop="cost_user_id">
              <el-select
                :loading="onLoading"
                style="width: 180px"
                v-model="updateForm.cost_user_name"
                filterable
                remote
                reserve-keyword
                placeholder="请选择"
                :remote-method="remoteUsers">
                <el-option :loading="onLoading" v-for="user in users" :key="user.id" :label="user.name" :value="user.name"></el-option>
              </el-select>
            </el-form-item></el-col>
              <el-col :span="6"><el-form-item label="申请人" prop="input_user_name">
              <el-input style="width: 180px" v-model="updateForm.input_user_name" :disabled="true"></el-input>
            </el-form-item></el-col>
            </el-row>
            <el-form-item label="申请类型" prop="applyType_id">
              <el-select v-model="updateForm.applyType_id" filterable placeholder="请选择申请类型" @change="statusChange(updateForm.applyType_id)">
                <el-option v-for="applyType in applyTypes" :key="applyType.id" :label="applyType.name" :value="applyType.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属项目" prop="pro_id" v-if="isGroup === false">
              <el-select
                v-model="updateForm.pro_id"
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
                v-model="updateForm.group_id"
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
              <el-select v-model="updateForm.type_id" placeholder="请选择">
                <el-option v-for="type in types" :key="type.id" :label="type.name" :value="type.id"></el-option>
              </el-select>
            </el-form-item>
            <el-row>
              <el-col :span="10">
                <el-form-item label="面单科目" prop="sbj_id">
                  <el-select v-model="updateForm.sbj_id" placeholder="请选择">
                    <el-option v-for="sbj in sbjs" :key="sbj.id" :label="sbj.name" :value="sbj.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="实际科目" prop="sbjR_id">
                  <el-select v-model="updateForm.sbjR_id" placeholder="请选择">
                    <el-option v-for="sbj in sbjs" :key="sbj.id" :label="sbj.name" :value="sbj.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="金额" prop="money">
              <el-input style="width: 150px" v-model="updateForm.money" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="实际状态">
              若本申请财务实际已付款,请备注 <el-button type="primary" plain @click="onClickActualPaid"> 实际已付款 </el-button>
            </el-form-item>
            <el-form-item label="用途" prop="use">
              <el-input type="textarea" autosize style="width: 300px" v-model="updateForm.use" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="note">
              <el-input type="textarea" autosize style="width: 300px" v-model="updateForm.note" auto-complete="off"></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="10">
                <el-form-item label="报销单号" prop="receipt_no">
                   <el-input autosize style="width: 180px" v-model="updateForm.receipt_no" placeholder="请填写报销单号"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="申请总数" prop="receipt_total">
                   <el-input autosize style="width: 180px" v-model="updateForm.receipt_total" placeholder="所属报销单下申请总条数！"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="操作栏">
              <el-button type="primary" @click="submitUpdateForm('updateForm')">确定修改</el-button>
              <el-button @click="visible.updateForm = false">取消修改</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <!--// 撤回申请表单-->
        <el-dialog center title="撤回申请" :visible.sync="visible.deleteForm" style="width: 800px;margin-left: 500px;margin-top: 150px">
          您是否确认要<a style="color: #ff4d51">撤回</a>该申请?<br />
          <a style="color: #ff4d51">撤回后将不可恢复!只能重新创建申请哦!</a>
          <div slot="footer" class="dialog-footer">
            <el-button type="danger" size="mini" @click="submitDeleteForm('updateForm')">确定撤回</el-button>
            <el-button size="mini" @click="visible.deleteForm = false">我再想想</el-button>
          </div>
        </el-dialog>
        <!--// Excel批量导入-->
        <el-dialog
          title="通过Excel表格一键导入 - 报销申请"
          :visible.sync="visible.excelForm"
          width="80%">
          <el-collapse style="width: 650px" v-model="activeNames" accordion>
            <el-collapse-item title="导入步骤: 选择Excel文件 → 点击数据检查 → 点击确认添加" name="1">
              <div>1.选择文件:在下面点击按钮,选择您要导入的表格文件,文件选择完后会自动检查表格格式,检查是否不该为空的数据有空.</div>
              <div>2.数据检查:格式检查通过后请您点击下面的[数据检查]按钮,将自动为您检查所有数据是否正确.</div>
              <div>3.确认添加:只有当所有数据都检查正确后,您就可以点击下面的[确认添加]按钮,您可以根据进度条查看进度!</div>
            </el-collapse-item>
            <el-collapse-item title="导入要求1: 文件要求" name="2">
              <div>1.导入的Excel文件必须是xls/xlsx/csv格式!</div>
              <div>2.导入的文件大小不得超过5mb,超过5mb可能您就选错了文件.</div>
              <div>3.一次性导入的数据不得超过300条,避免数据过多出现不可预料的错误.</div>
              <div>4.请勿在网络状况不佳的时候导入,容易出错.</div>
            </el-collapse-item>
            <el-collapse-item title="导入要求2: 表头要求 *有改动" name="3">
              <div>1.表头规定为13项：*日期、*申请类型、*分组名称、*报销分公司、*报销人、*报销类型、*面单科目、*实际科目、*金额、*用途、备注、*报销单号、*申请总条数</div>
              <div>2.有*号的为必填，不得有空</div>
            </el-collapse-item>
            <el-collapse-item title="导入要求3: 内容要求" name="4">
              <div>1.日期那一栏请设置为文本格式的 2018/00/00 格式!(提示:如果您将日期转换到文本时变成了5位数整数,那么您可以使用这种方法:将日期那一栏选中，点击[数据]-[分列]-点击下一步-点击下一步-勾选"文本"-完成)</div>
              <div>2.申请类型 ：综合报销 / 基础报销 / 物资采购 / 工人付款</div>
              <div>3.报销类型 ：行政 / 经营 / 工程 / 其他</div>
              <div>4.科目明细 ：本平台报销科目中已存在的科目明细名称</div>
              <div>5.报销人 ：本平台中已存在的员工姓名</div>
              <div>6.分组名称 ：本平台报销分组中已存在分组名称</div>
              <div>7.项目名称 ：本平台经营管理中已存在项目名称</div>
              <div>8.用途 ：内容不得超过10行</div>
              <div>9.报销单号 ：请按照项目部编号规则来命名</div>
              <div>10.申请总数 ：所属报销单的所有申请的总条数</div>
            </el-collapse-item>
          </el-collapse>
          建议您下载表格模板：<a style="color: #DD4A68" href="http://oaapi.hjdlsz.com/Demo4.xlsx"> <i class="el-icon-download">申请模板</i></a><br />
          报销单编号规则：<a style="color: #DD4A68" href="http://oaapi.hjdlsz.com/receipt_no_Rules.doc"> <i class="el-icon-download">编号规则</i></a><br />
          <uploadExcel :SkipApproval="SkipApproval"></uploadExcel>
          <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onExcelComplete">关 闭</el-button>
      </span>
        </el-dialog>
        <!--// 创建报销单-->
        <el-dialog title="创建报销申请单" :visible.sync="visible.costForm" center>
          <el-form :model="costForm" :inline="true" :rules="rules_costForm" ref="costForm">
            <el-row>
                <el-form-item label="报销单号" prop="receipt_no">
                  <el-input @blur="checkReceiptNo" size="mini" autosize style="width: 130px" v-model="costForm.receipt_no"></el-input>
                </el-form-item>
                <el-tag v-if="check_receipt_no===true" size="small" type="success">恭喜您,可用!</el-tag>
                <el-tag v-else size="small" type="warning">不可用</el-tag>
                <el-button style="margin-right: 30px" size="mini" type="success" @click="onClickCreateNewReceiptNo">点击生成(推荐)</el-button>
                <el-form-item label="报销人" prop="cost_user_id">
                  <el-select
                    size="mini" style="width: 100px"
                    v-model="costForm.cost_user_id"
                    filterable remote reserve-keyword
                    placeholder="请选择" :remote-method="remoteUsers">
                    <el-option v-for="user in users" :key="user.id" :label="user.name" :value="user.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="申请人"><el-input size="mini" style="width: 100px" v-model="costForm.input_user_name" :disabled="true"></el-input></el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="报销申请条目：" style="margin-bottom: 5px;">
                共 {{this.costForm.list.length}} 条
                <el-button size="mini" type="primary" @click="addList" class="btn-min-w">添加</el-button>
              </el-form-item>
              <el-form-item>
                <table v-for="(item,index) in costForm.list" :key="index" class="table-apply">
                  <tr>
                    <el-row style="height: 40px;margin-bottom: 5px">
                      <td style="vertical-align: middle;">序号: <a style="color: #DD4A68"> &nbsp;{{ index }} &nbsp; &nbsp; </a></td>
                      <td>
                        <el-form-item :prop="'list.' + index + '.applyType_id'"  :rules="{ required: true, message: '请选择申请类型', trigger: 'blur' }">
                          <el-select style="width: 150px" size="mini" v-model="item.applyType_id" placeholder="申请类型" filterable clearable>
                            <el-option v-for="applyType in applyTypes" :key="applyType.id" :label="applyType.name" :value="applyType.id"></el-option>
                          </el-select>
                        </el-form-item></td>
                      <td v-if="item.applyType_id===1">
                        <el-form-item :prop="'list.' + index + '.group_id'"  :rules="{ required: true, message: '请选择所属分组', trigger: 'blur' }">
                            <el-select
                              style="width: 250px" size="mini"
                              v-model="item.group_id"
                              filterable remote reserve-keyword clearable
                              placeholder="所属分组" :remote-method="remoteGroups">
                              <el-option v-for="group in groups" :key="group.id" :label="group.name" :value="group.id"></el-option>
                            </el-select>
                        </el-form-item>
                      </td>
                      <td v-if="item.applyType_id!==1">
                        <el-form-item :prop="'list.' + index + '.pro_id'"  :rules="{ required: true, message: '请选择所属项目', trigger: 'blur' }">
                            <el-select
                              style="width: 250px" size="mini"
                              v-model="item.pro_id"
                              filterable remote reserve-keyword clearable
                              placeholder="所属项目" :remote-method="remoteProjects">
                              <el-option v-for="pro in pros" :key="pro.id" :label="pro.name" :value="pro.id"></el-option>
                            </el-select>
                        </el-form-item>
                      </td>
                      <td>
                        <el-form-item :prop="'list.' + index + '.type_id'"  :rules="{ required: true, message: '请选择报销类型', trigger: 'blur' }">
                          <el-select style="width: 100px" size="mini" v-model="item.type_id" placeholder="报销类型">
                            <el-option v-for="type in types" :key="type.id" :label="type.name" :value="type.id"></el-option>
                          </el-select>
                        </el-form-item>
                      </td>
                      <td>
                          <el-form-item :prop="'list.' + index + '.sbjR_id'"  :rules="{ required: true, message: '请选择实际科目', trigger: 'blur' }">
                            <el-select style="width: 150px" size="mini" v-model="item.sbjR_id" placeholder="实际科目" filterable clearable>
                              <el-option v-for="sbj in sbjs" :key="sbj.id" :label="sbj.name" :value="sbj.id"></el-option>
                            </el-select>
                          </el-form-item>
                      </td>
                      <td>
                          <el-form-item :prop="'list.' + index + '.sbj_id'"  :rules="{ required: true, message: '请选择面单科目', trigger: 'blur' }">
                            <el-select style="width: 150px" size="mini" v-model="item.sbj_id" placeholder="面单科目" filterable clearable>
                              <el-option v-for="sbj in sbjs" :key="sbj.id" :label="sbj.name" :value="sbj.id"></el-option>
                            </el-select>
                          </el-form-item>
                      </td>
                    </el-row>
                    <el-row>
                      <td>
                        <el-form-item :prop="'list.' + index + '.date'"  :rules="{ required: true, message: '请选择日期', trigger: 'blur' }">
                          <el-date-picker style="width: 180px" size="mini" v-model="item.date" value-format="timestamp" type="date" placeholder="面单日期"></el-date-picker>
                        </el-form-item>
                      </td>
                      <td>
                        <el-form-item :prop="'list.' + index + '.money'"  :rules="{ required: true, message: '请输入金额', trigger: 'blur' }">
                          金额: <el-input-number :precision="2" :controls="false" style="width: 100px" size="mini" v-model="item.money" placeholder="发生金额"></el-input-number>
                        </el-form-item>
                      </td>
                      <td>
                        <el-form-item :prop="'list.' + index + '.use'"  :rules="{ required: true, message: '请输入用途', trigger: 'blur' }">
                         <el-input type="textarea" autosize style="width: 300px" size="mini" v-model="item.use" placeholder="用途"></el-input>
                        </el-form-item>
                      </td>
                      <td>
                        <el-form-item prop="note">
                         <el-input type="textarea" autosize style="width: 150px" size="mini" v-model="item.note" placeholder="备注"></el-input>
                          <el-button type="text" size="mini" @click="onClickActualPaid(item)"> 实际已付款 </el-button>
                        </el-form-item>
                      </td>
                      <td style="vertical-align: middle;">
                        <el-button icon="el-icon-minus" type="danger" size="mini" style="padding: 5px" circle @click="delList(index)"></el-button>
                      </td>
                    </el-row>
                    </tr>
                </table>
              </el-form-item>
              <el-form-item label="操作栏" >
                <el-button size="mini" style="width: 150px" type="primary" @click="submitCostForm('costForm')">确定创建</el-button>
                <el-button size="mini" style="width: 150px" @click="visible.costForm = false">取 消</el-button>
                <el-button size="mini" style="width: 150px" @click="resetCostForm">重 置</el-button>
              </el-form-item>
            </el-row>
          </el-form>
        </el-dialog>
      </div>
    </div>
</template>
<!--
    Permissions on this page:
    使用Excel批量导入: create_costApply_Excel   onCreateExcel()
-->
<script>
  import { parseTime } from '../../../utils/index'
  import { getUsers } from '../../../api/user'
  import { getProjects } from '../../../api/project'
  import { getType, getSbjType } from '../../../api/costBasic'
  import { getGroups } from '../../../api/costGeneral'
  import { createApply, getApply, updateApply, deleteApply, createReceiptNo, createRceipt } from '../../../api/costApply'
  import uploadExcel from './uploadExcelApply.vue'
  import { getView } from '../../../api/user'
  import ElSelectDropdown from 'element-ui/packages/select/src/select-dropdown'
  import { updateWorkerApply } from '../../../api/workerApply'

  const defaultCostForm = {
    cost_user_id: null,
    receipt_no: null,
    receipt_total: 1,
    list: [{ applyType_id: null, group_id: null, pro_id: null, type_id: null, sbjR_id: null, sbj_id: null, date: null, money: 0, use: null, note: null }]
  }
  export default {
    name: 'myApply',
    components: {
      ElSelectDropdown,
      uploadExcel
    },
    data() {
      return {
        // 我提交的申请
        mineInput: [],
        // 我的报销
        mineCost: [],
        // 表单可视属性
        visible: {
          addForm: false,
          updateForm: false,
          excelForm: false,
          deleteForm: false,
          costForm: false
        },
        input_on_loading: false,
        costForm: Object.assign({}, defaultCostForm, { input_user_id: this.$store.getters.userId, input_user_name: this.$store.getters.name }),
        searchForm: {
          status: null
        },
        status: [
          { id: null, name: '所有' },
          { id: 0, name: '待审批' },
          { id: 1, name: '待打款' },
          { id: 2, name: '已打款' },
          { id: 3, name: '异常' }
        ],
        activeNames: ['0'], // 导入提示组件当前选中对象
        isGroup: null, // 是否是综合报销
        addForm: {
          date: null,
          cost_user_id: null,
          input_user_id: this.$store.getters.name,
          applyType_id: null,
          pro_id: null,
          group_id: null,
          type_id: null,
          sbj_id: null,
          sbjR_id: null,
          money: null,
          use: null,
          note: null,
          receipt_no: null,
          receipt_total: null
        },
        updateForm: {
          date: null,
          cost_user_id: null,
          input_user_id: this.$store.getters.name,
          applyType_id: null,
          pro_id: null,
          group_id: null,
          type_id: null,
          sbj_id: null,
          sbjR_id: null,
          cost_user_name: null,
          input_user_name: null,
          money: null,
          use: null,
          note: null,
          valid: null,
          receipt_no: null,
          receipt_total: null
        }, // Add表单对象
        users: [], // 用户表
        types: [], // 报销类型
        sbjs: [], // 报销科目
        pros: [], // 项目查询
        groups: [], // 分组
        user_department_id: null, // 当前用户的部门
        SkipApproval: 0, // 是否跳过审批
        applyTypes: [
          { id: 1, name: '综合报销' },
          { id: 2, name: '基础报销' },
          { id: 3, name: '物资采购' },
          { id: 4, name: '工人付款' }
        ],
        rules: {
          date: [
            { required: true, message: '日期不得为空', trigger: 'blur' }
          ],
          applyType_id: [
            { required: true, message: '报销类型不得为空,请与各公司文员明确类型!', trigger: 'blur' }
          ],
          cost_user_id: [
            { required: true, message: '报销人不得为空', trigger: 'blur' }
          ],
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
          money: [
            { required: true, message: '报销金额不得为空', trigger: 'blur' }
          ],
          sbj_id: [
            { required: true, message: '面单科目不得为空', trigger: 'blur' }
          ],
          sbjR_id: [
            { required: true, message: '实际科目不得为空', trigger: 'blur' }
          ],
          use: [
            { required: true, message: '报销实际用途不得为空', trigger: 'blur' }
          ],
          receipt_no: [
            { required: true, message: '报销单号不得为空', trigger: 'blur' }
          ],
          receipt_total: [
            { required: true, message: '报销单下申请总数不得为空', trigger: 'blur' }
          ]
        },
        rules_costForm: {
          cost_user_id: [
            { required: true, message: '报销人不得为空', trigger: 'blur' }
          ],
          receipt_no: [
            { required: true, message: '报销单号不得为空', trigger: 'blur' }
          ]
        },
        // 分页器-左
        pageInfo_left: {
          currentPage: 1,
          pageSize: 20,
          totalCount: 0
        },
        // 分页器-右
        pageInfo_right: {
          currentPage: 1,
          pageSize: 20,
          totalCount: 0
        },
        searchForm_left: {
          financialStatus: null,
          cost_user_id: null
        },
        searchForm_right: {
          financialStatus: null,
          input_user_id: null
        },
        onLoading: false,
        showCancel: false,
        check_receipt_no: false,
        createState: null // 用于撤回申请时修改付款流程的的状态
      }
    },
    filters: {
      // filters里的过滤器非:formatter属性所用的过滤方法,而是用{{props.row}}来显示内容时所用的过滤器
      parseTime(value) {
        if (!value) return ''
        value = value.toString()
        return parseTime(value, '{y}-{m}-{d}')
      },
      // 一级到四级的审批状态过滤器
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
      },
      // 财务审批状态过滤器
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
      },
      applyTypeFormat: function(row) {
        if (row === 1) {
          return '综合报销'
        }
        if (row === 2) {
          return '基础报销'
        }
        if (row === 3) {
          return '物资采购'
        }
        if (row === 4) {
          return '工人付款'
        }
      }, // 表格中根据申请类型过滤,显示分组名称或者项目名称
      validStatusFormat: function(row) {
        if (row === 1) {
          return '正常已生效'
        } else return '已撤回或异常'
      } // 表格中有效值的状态过滤
    },
    methods: {
      /** -------- 点击事件类 -------- */
      onClickSearch() {
        const params = {
          cost_user_id: this.$store.getters.userId,
          valid: 1,
          status: this.searchForm.status
        }
        const params_ = {
          input_user_id: this.$store.getters.userId,
          valid: 1,
          status: this.searchForm.status
        }
        this.fetchApply_left(params)
        this.fetchApply_right(params_)
      },
      onClickShowCancel() {
        const params = {
          cost_user_id: this.$store.getters.userId,
          valid: 0
        }
        const params_ = {
          input_user_id: this.$store.getters.userId,
          valid: 0
        }
        this.fetchApply_left(params)
        this.fetchApply_right(params_)
      },
      onDeleteApply(row) {
        if (row.note === '劳务付款生成报销申请') {
          this.createState = 0
        }
        if (row.input_user_id === this.$store.getters.userId || row.cost_user_id === this.$store.getters.userId) {
          if (row.firstStatus === 0) {
            this.isGroup = row.applyType_id === 1
            this.updateForm = Object.assign({}, row)
            this.updateForm.valid = 0
            this.visible.deleteForm = true
          } else {
            this.$message({
              message: '抱歉,该申请已经进入审核阶段,无法修改!',
              type: 'warning'
            })
          }
        } else {
          this.$message({
            message: '抱歉,您只能修改您的报销或您创建的申请!',
            type: 'warning'
          })
        }
      },
      onCreateApply() {
        this.visible.addForm = true
      }, // 创建申请
      onCreateApply_() {
        this.addForm = Object.assign({}, { 'SkipApproval': 1 }, this.addForm)
        this.visible.addForm = true
      },
      onCreateLoan() {
        this.addForm = Object.assign({}, { 'isCreateLoan': 1 }, this.addForm)
        const params = { cost_user_id: this.$store.getters.userId }
        createReceiptNo(params).then(res => {
          this.addForm.receipt_no = res.data + 'YSZ-BL'
          this.addForm.receipt_total = 1
          this.addForm.use = '补录历史欠款'
          this.addForm.date = 1541001600000
          this.addForm.type_id = 4
          this.addForm.note = '[本申请实际已付款]'
          // 刷新检查
          this.visible.addForm = true
        })
      }, // 补录应收账款
      onCreateExcel() {
        /** 权限检查 */
        if (this.actionCheck_.actionCheck('create_costApply_Excel#') === false) {
          this.$message.error('错误提示,您没有该操作的权限!')
          return false
        }
        this.SkipApproval = 0
        this.visible.excelForm = true
      }, // 打开Excel导入组件
      onCreateExcel_() {
        /** 权限检查 */
        if (this.actionCheck_.actionCheck('create_costApply_Excel#') === false) {
          this.$message.error('错误提示,您没有该操作的权限!')
          return false
        }
        this.SkipApproval = 1
        this.visible.excelForm = true
      },
      onUpdateApply(row) {
        if (row.input_user_id === this.$store.getters.userId || row.cost_user_id === this.$store.getters.userId) {
          if (row.firstStatus === 0) {
            this.isGroup = row.applyType_id === 1
            this.updateForm = Object.assign({}, row)
            this.updateForm.date = this.updateForm.date * 1000
            this.updateForm.cost_user_id = row.cost_user_id
            this.visible.updateForm = true
          } else {
            this.$message({
              message: '抱歉,该申请已经进入审核阶段,无法修改!',
              type: 'warning'
            })
          }
        } else {
          this.$message({
            message: '抱歉,您只能修改您的报销或您创建的申请!',
            type: 'warning'
          })
        }
      },
      onExcelComplete() {
        this.visible.excelForm = false
        this.SkipApproval = 0
        this.fetchApply_left(this.finalSearchForm_left)
        this.fetchApply_right(this.finalSearchForm_right)
      }, // 导入完成 按钮被点击事件
      onCreateCostForm() {
        this.visible.costForm = true
      }, // 创建报销单
      addList() {
        this.costForm.list.push({ applyType_id: null, group_id: null, pro_id: null, type_id: null, sbjR_id: null, sbj_id: null, date: null, money: 0, use: null, note: null })
      }, // 增加
      delList(index) {
        if (this.costForm.list.length === 1) {
          this.$message({ message: '至少一条申请', type: 'warning' })
          return
        }
        this.costForm.list.splice(index, 1)
      }, // 减少
      onClickCreateNewReceiptNo() {
        const params = { cost_user_id: this.$store.getters.userId }
        createReceiptNo(params).then(res => {
          this.costForm.receipt_no = res.data
          // 刷新检查
          this.checkReceiptNo()
        })
      },
      /** -------- 过滤类 方法 -------- */
      statusChange(valId) {
        this.isGroup = valId === 1
        // console.log(this.isGroup)
      }, // 表单中申请类型选择器过滤
      applyTypeFormat(row, column) {
        if (row.applyType_id === 1) {
          return '综合报销'
        }
        if (row.applyType_id === 2) {
          return '基础报销'
        }
        if (row.applyType_id === 3) {
          return '物资采购'
        }
        if (row.applyType_id === 4) {
          return '工人付款'
        }
      }, // 表格中根据申请类型过滤,显示分组名称或者项目名称
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
      }, // 表格中一级到四级的审批状态过滤器
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
      }, // 表格中财务审批状态过滤器
      statusFormat(row, column) {
        if (row.valid === 0) {
          return '已撤回'
        } else {
          if (row.money <= 3000) {
            // 如果金额小于3000,三级审核
            if (row.firstStatus === 1) {
              if (row.secondStatus === 1) {
                if (row.thirdStatus === 1) {
                  return this.approvalFinancialStatus(row.financialStatus)
                } else return this.approvalStatus(row.thirdStatus)
              } else return this.approvalStatus(row.secondStatus)
            } else return this.approvalStatus(row.firstStatus)
          } else {
            // 如果金额大于3000,四级审核
            if (row.firstStatus === 1) {
              if (row.secondStatus === 1) {
                if (row.thirdStatus === 1) {
                  if (row.fourthStatus === 1) {
                    return this.approvalFinancialStatus(row.financialStatus)
                  } else return this.approvalStatus(row.fourthStatus)
                } else return this.approvalStatus(row.thirdStatus)
              } else return this.approvalStatus(row.secondStatus)
            } else return this.approvalStatus(row.firstStatus)
          }
        }
      }, // 表格中根据每级审核状态过滤,显示当前申请的最终状态
      activeStatusFilters(row) {
        if (row.money < 3000 || row.money === 3000) {
          // 如果金额小于3000,三级审核
          if (row.firstStatus === 0) return 0
          else if (row.firstStatus === 2) return 0
          else if (row.secondStatus === 0) return 1
          else if (row.secondStatus === 2) return 1
          else if (row.thirdStatus === 0) return 2
          else if (row.thirdStatus === 2) return 2
          else return 3
        } else {
          // 如果金额大于3000,四级审核
          if (row.firstStatus === 0) return 0
          else if (row.firstStatus === 2) return 0
          else if (row.secondStatus === 0) return 1
          else if (row.secondStatus === 2) return 1
          else if (row.thirdStatus === 0) return 2
          else if (row.thirdStatus === 2) return 2
          else if (row.fourthStatus === 0) return 3
          else if (row.fourthStatus === 2) return 3
          else return 4
        }
      }, // 表格中根据每级审核状态过滤,显示当前步骤条的当前步骤
      dateFormat(row, column) {
        const date = row[column.property]
        return parseTime(date, '{y}-{m}-{d}')
      }, // 时间格式化
      checkReceiptNo() {
        const value = this.costForm.receipt_no
        getApply({ 'receipt_no_Exact': value }).then(res => {
          this.check_receipt_no = res.data._items.length <= 0
        })
      }, // 检查报销单是否存在
      onClickActualPaid(item) {
        if (this.visible.updateForm === true) {
          if (this.updateForm.note !== null) this.updateForm.note = '[本申请实际已付款]' + this.updateForm.note
          else this.updateForm.note = '[本申请实际已付款]'
        } else if (this.visible.addForm === true) {
          if (this.addForm.note !== null) this.addForm.note = '[本申请实际已付款]' + this.addForm.note
          else this.addForm.note = '[本申请实际已付款]'
        } else if (this.visible.costForm === true) {
          if (item.note !== null) item.note = '[本报销单实际已付款]' + item.note
          else item.note = '[本报销单实际已付款]'
        }
      },
      /** -------- 表格样式设置方法 -------- */
      rowStyle() {
        return 'height: 25px'
      },
      cellStyle() {
        return 'padding: 2px'
      },
      /** -------- 远程搜索类 -------- */
      remoteUsers(query) {
        this.onLoading = true
        let params = {}
        if (query.trim() !== '') {
          params = { name: query.trim() }
        }
        getUsers(params).then(res => {
          this.users = res.data._items
          this.onLoading = false
        })
      },
      remoteProjects(query) {
        let params = {}
        params = {}
        if (query.trim() !== '') {
          params = { name: query.trim() }
        }
        this.input_on_loading = true
        getProjects(params).then(res => {
          this.pros = res.data._items
          this.input_on_loading = false
        })
      },
      remoteGroups(query) {
        let params = {}
        params = {}
        if (query.trim() !== '') {
          params = { name: query.trim() }
        }
        this.input_on_loading = true
        getGroups(params).then(res => {
          this.groups = res.data._items
          this.input_on_loading = false
        })
      },
      /** -------- 接口类 -------- */
      fetchSbjType() {
        getSbjType({ valid: 1 }).then(res => {
          this.sbjs = res.data
        })
      },
      fetchType() {
        getType().then(res => {
          this.types = res.data
        })
      },
      fetchProjects() {
        getProjects().then(res => {
          this.pros = res.data._items
        })
      },
      fetchUsers() {
        getUsers().then(res => {
          this.users = res.data._items
        })
      },
      fetchGroups() {
        getGroups().then(res => {
          this.groups = res.data._items
        })
      },
      fetchApply_left(params) {
        this.searchForm_left.cost_user_id = this.$store.getters.userId
        getApply(params).then(res => {
          this.mineCost = res.data._items
          this.pageInfo_left.totalCount = res.data._meta.totalCount
        })
      },
      fetchApply_right(params) {
        this.searchForm_right.input_user_id = this.$store.getters.userId
        getApply(params).then(res => {
          this.mineInput = res.data._items
          this.pageInfo_right.totalCount = res.data._meta.totalCount
        })
      },
      checkDepartment() {
        getView({ 'id': this.$store.getters.userId }).then(res => {
          this.user_department_id = res.data.department_id
        })
      },
      /** ------- 表单处理类 -------- */
      submitAddForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.addForm.date = Math.floor(this.addForm.date / 1000)
            createApply(this.addForm).then(res => {
              if (res.data.bCode === 101) {
                this.$notify({
                  title: '成功',
                  message: '新增成功',
                  type: 'success',
                  position: 'top-right'
                })
                this.fetchApply_left(this.finalSearchForm_left)
                this.fetchApply_right(this.finalSearchForm_right)
              } else {
                this.$notify({
                  title: '失败',
                  message: res.data.bData,
                  type: 'warning',
                  position: 'top-right'
                })
              }
              this.visible.addForm = false
              this.resetForm()
            })
          } else {
            console.log('提交错误!!')
            return false
          }
        })
      },
      submitUpdateForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.updateForm.date = Math.floor(this.updateForm.date / 1000)
            updateApply(this.updateForm).then(res => {
              if (res.data.bCode === 101) {
                this.$notify({
                  title: '成功',
                  message: '更新成功',
                  type: 'success',
                  position: 'top-right'
                })
                this.fetchApply_left(this.finalSearchForm_left)
                this.fetchApply_right(this.finalSearchForm_right)
              } else {
                this.$notify({
                  title: '失败',
                  message: res.data.bData,
                  type: 'warning',
                  position: 'top-right'
                })
              }
              this.visible.updateForm = false
            })
          } else {
            console.log('提交错误!!')
            return false
          }
        })
      },
      submitDeleteForm() {
        deleteApply(this.updateForm).then(res => {
          if (res.data.bCode === 101) {
            this.$notify({
              title: '撤回成功',
              type: 'success',
              position: 'top-right'
            })
            if (this.updateForm.wa_id !== null) {
              console.log(this.updateForm)
              updateWorkerApply({ id: this.updateForm.wa_id, create_state: 0 }).then(
                console.log('updateWorkerApply', res)
              )
            }
            this.fetchApply_left(this.finalSearchForm_left)
            this.fetchApply_right(this.finalSearchForm_right)
          } else {
            for (const key in res.data.bData) {
              this.$notify({
                title: '失败',
                message: res.data.bData[key],
                type: 'warning',
                position: 'top-right'
              })
            }
          }
          this.visible.deleteForm = false
        })
      },
      resetForm() {
        this.addForm = {
          date: null,
          cost_user_id: null,
          input_user_id: this.$store.getters.name,
          applyType_id: null,
          pro_id: null,
          group_id: null,
          type_id: null,
          sbj_id: null,
          money: null,
          use: null,
          note: null,
          receipt_no: null,
          receipt_total: null
        }
      },
      resetCostForm() {
        this.costForm = Object.assign({}, defaultCostForm, { input_user_id: this.$store.getters.userId, input_user_name: this.$store.getters.name })
        this.costForm.list = [{ applyType_id: null, group_id: null, pro_id: null, type_id: null, sbjR_id: null, sbj_id: null, date: null, money: 0, use: null, note: null }]
      },
      submitCostForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            createRceipt(this.costForm).then(res => {
              this.$notify({ title: '创建完毕', message: '报销申请单已创建完毕', type: 'success', position: 'top-right' })
              this.resetCostForm()
              this.fetchApply_left(this.finalSearchForm_left)
              this.fetchApply_right(this.finalSearchForm_right)
              this.visible.costForm = false
            })
          } else {
            console.log('提交错误!!')
            return false
          }
        })
      },
      /** ------- 分页器方法 ------- */
      handleSizeChange_left(pageSize) {
        this.pageInfo_left.pageSize = pageSize
        this.fetchApply_left(this.finalSearchForm_left)
      },
      handleCurrentChange_left(currentPage) {
        this.pageInfo_left.currentPage = currentPage
        this.fetchApply_left(this.finalSearchForm_left)
      },
      handleSizeChange_right(pageSize) {
        this.pageInfo_right.pageSize = pageSize
        this.fetchApply_right(this.finalSearchForm_right)
      },
      handleCurrentChange_right(currentPage) {
        this.pageInfo_right.currentPage = currentPage
        this.fetchApply_right(this.finalSearchForm_right)
      }
    },
    mounted() {
      this.fetchApply_left(this.finalSearchForm_left)
      this.fetchApply_right(this.finalSearchForm_right)
      this.fetchSbjType({ valid: 1 })
      this.fetchType()
      this.fetchGroups()
      this.fetchProjects()
      this.fetchUsers()
      this.checkDepartment() // 检查当前用户的部门
    },
    computed: {
      finalSearchForm_left() {
        this.searchForm_left.cost_user_id = this.$store.getters.userId
        const res = Object.assign({}, this.searchForm_left)
        res.pageSize = this.pageInfo_left.pageSize
        res.page = this.pageInfo_left.currentPage
        return res
      },
      finalSearchForm_right() {
        this.searchForm_right.input_user_id = this.$store.getters.userId
        const res = Object.assign({}, this.searchForm_right)
        res.pageSize = this.pageInfo_right.pageSize
        res.page = this.pageInfo_right.currentPage
        return res
      }
    }
  }
</script>

<style scoped>
  .btnUpdate{
    padding: 5px;
    /*width: 60px;*/
  }
  .body-left{
    float: left;
    white-space: normal;
    margin-right: 20px;
    margin-bottom: 10px;
  }
  .body-right{
    float: left;
    white-space: normal;
  }
  .popoverBtn{
    padding: 5px 100px;
    border-width: 3px;
    margin-bottom: 5px;
  }
  .popover{
    position: center;
  }
  .table-apply{
    border-radius: 10px 10px;
    background-color: #d6e9c6;
    margin-bottom: 5px;
    width: 930px
  }
</style>
<style>
  .myApply .el-dialog, .el-dialog__header {
    padding: 5px 5px 5px!important;
  }
  .myApply .el-dialog, .el-dialog__title {
    line-height: 20px;
    font-size: 15px;
    color: #5f82c7;
  }
  .myApply .el-dialog, .el-dialog--center .el-dialog__body {
    padding: 5px 5px 5px;
  }
  .myApply .el-dialog, .el-form-item__content {
    line-height: 20px;
    position: relative;
    font-size: 14px;
  }
  .myApply .el-dialog, .el-form-item__label {
    line-height: 27px;
  }
</style>
