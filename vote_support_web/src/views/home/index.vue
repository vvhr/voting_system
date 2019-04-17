<template>
  <div class="app-container">
    <div>
      <div class="title-name">
        欢迎访问华建电力生产经营管理系统<br />
      </div>
      <div class="home-index" style="display: flex;justify-content:flex-start">
            <!--导航 - 我的任务-->
            <el-card class="box-card" style="width: 520px">
              <div slot="header" class="box-card-quick">
                <span>我的任务</span>
              </div>
              <div style="text-align: center">
                <el-button type="success" size="small" @click="onQuick('1')">会议中心</el-button>
                <el-button type="success" size="small" @click="onQuick('9')">经营管理</el-button>
                <el-button type="success" size="small" @click="onQuick('2')">富华电力</el-button>
                <el-button type="success" size="small" @click="onQuick('3')">华建电力</el-button>
                <el-button type="success" size="small" @click="onQuick('4')">源通电力</el-button>
              </div>
            </el-card>
            <!--导航 - 综合-->
            <el-card class="box-card" style="width: 340px">
              <div slot="header" class="box-card-quick">
                <span>个人快捷导航</span>
              </div>
              <el-button type="primary" size="small" @click="onQuick('5')">我的申请</el-button>
              <el-button type="primary" size="small" @click="onQuick('6')">我的权限</el-button>
              <el-button type="warning" size="small" @click="onQuick('7')">修改密码</el-button>
            </el-card>
            <!--导航 - 待我审批-->
            <el-card class="box-card" style="width: 250px" v-if="user_department_id!==54">
              <div slot="header" class="box-card-quick">
                <span>待我审批</span>
              </div>
              <div style="text-align: center">
                <el-badge :value="waitApplyCount" class="item">
                  <el-button type="primary" size="small" @click="onQuick('8')">报销审批</el-button>
                </el-badge>
                <el-button type="primary" size="small" @click="onQuick('14')">开票审批</el-button>
              </div>
            </el-card>
            <!--导航 - 财务待我审批-->
            <el-card class="box-card" style="width: 450px" v-if="user_department_id===54">
              <div slot="header" class="box-card-quick">
                <span>待我审批 - 财务</span>
              </div>
              <el-badge :value="waitApplyCount_Fin" class="item">
                <el-button type="primary" size="small" @click="onQuick('10')">报销审批</el-button>
              </el-badge>
              <el-button type="primary" size="small" @click="onQuick('11')">开票审批</el-button>
              <el-badge :value="waitPayingProofCount" class="item">
                <el-button type="primary" size="small" @click="onQuick('12')">凭证审批</el-button>
              </el-badge>
              <el-button type="primary" size="small" @click="onQuick('13')">收款审批</el-button>
            </el-card>
            <!--导航 - 财务待我审批-->
            <el-card class="box-card" style="width: 350px">
              <div slot="header" class="box-card-quick">
                <span>用工审批</span>
              </div>
              <el-badge :value="waitCount" class="item">
              <el-button type="primary" size="small" @click="onQuick('15')">我的申请</el-button>
              </el-badge>
              <el-badge :value="useWorkerCount" class="item">
                <el-button type="primary" size="small" @click="onQuick('16')">用工审批</el-button>
              </el-badge>
              <el-badge :value="payCount" class="item">
              <el-button type="primary" size="small" @click="onQuick('17')">付款审批</el-button>
              </el-badge>
            </el-card>
      </div>
      <div class="home-index-version" style="width: 800px">
        <!--最新-->
        <el-card class="box-card-update" style="width: auto">
          <div slot="header" class="box-card-title">
            <el-badge value="new" class="item">
              <span>2019-4-4 更新内容 </span>
              <el-button type="text" @click="showUpdate20190322 = !showUpdate20190322">展开查看详情</el-button><br />
            </el-badge>
          </div>
          <div v-if="showUpdate20190322" style="font-size: 14px;">
           <pre>
       <b>用工申请和生产管理模块页面优化</b>
      1.增加了工程量excel文件上传
      2.流程调整.审批时间全部系统生成
      3.报销审批:劳务付款预支对接到付款审批申请支付金额
      4.付款审批:对接到结算中心
      5.系统界面优化统一表格.除华建的任务分配和工程造价.这两个页面比较复杂
           </pre>
          </div>
        </el-card>
        <el-card class="box-card-update" style="width: auto">
          <div slot="header" class="box-card-title">
              <span>2019-3-22 更新内容 </span>
              <el-button type="text" @click="showUpdate20190322 = !showUpdate20190322">展开查看详情</el-button><br />
          </div>
          <div v-if="showUpdate20190322" style="font-size: 14px;">
           <pre>
       <b>用工申请</b>
      1.我的申请添加待考核按钮,并太有待考核申请条数的提示,页面结构调整优化
      2.用工审批:界面优化,优化审核流程,根绝审核流程变动调整了界面
      3.付款审批:界面优化,流程变为4级审核,
      4.首页添加:用工申请页面快捷跳转,以及显示是否有需要审核的申请条数的提示
           </pre>
          </div>
        </el-card>
        <!--旧版本-->
        <el-card class="box-card-update" style="width: auto">
          <div slot="header" class="box-card-title">
            <span>2019-3-20 更新内容 </span>
            <el-button type="text" @click="showUpdate20190320 = !showUpdate20190320">展开查看详情</el-button><br />
          </div>
          <div v-if="showUpdate20190320" style="font-size: 14px;">
           <pre>
     <b>源通物资采购模块</b>
     1.添加审批设置界面,主要通能添加物资采购流程的审批人员.
     2.添加采购申请界面:有筛选功能,以及创建申请的功能,能够查询审批进度
     3.采购审批界面:主要有审批人进行操作审批,并最后申城报销申请
     4:用工申请,待审批增加显示待审批的申请条数
           </pre>
          </div>
        </el-card>
        <el-card class="box-card-update" style="width: auto">
          <div slot="header" class="box-card-title">
            <span>2019-3-12 更新内容 </span>
            <el-button type="text" @click="showUpdate20190312 = !showUpdate20190312">展开查看详情</el-button><br />
          </div>
          <div v-if="showUpdate20190312" style="font-size: 14px;">
           <pre>
     <b>用工模块优化</b>
     1.我的申请界面,添加工人审核:主要填写工人费用,及其明细.
     2.付款审批增加表格展开项用于展示工人费用明细
     3.付款审批生成报销申请:可以多次申请,知道工人费用完全结算完成
     4:修护付款审批驳回产生的无效报销申请之后,在用工审批不能重新提交劳务付款申请的bug
     5.数据库优化.
           </pre>
          </div>
        </el-card>
        <el-card class="box-card-update" style="width: auto">
          <div slot="header" class="box-card-title">
            <span>2019-3-11 更新内容 </span>
            <el-button type="text" @click="showUpdate20190311 = !showUpdate20190311">展开查看详情</el-button><br />
          </div>
          <div v-if="showUpdate20190311" style="font-size: 14px;">
           <pre>
     <b>用工申请模块优化</b>
     1.添加我的申请界面,该界面可由任何人操作.
     2.添加用工审批界面,该界面主要由相关审批人进行,审批,审批完成有成婧点击生成付款审批(劳务付款审批)
     3.添加付款审批(劳务付款审批),该界面由相关人员进行审批.审批完成由成婧点击生成报销申请
     4:审批设置:这个是用来确定流程审核人的,目前只有杨总贾总有修改的权利.改界面主要是利于修改各个阶段的审批人.方便后期维护
     5.顶部操作项显示优化.大家可以在使用的时候多多提出意见,以便后续优化提升用户体验
           </pre>
          </div>
        </el-card>
        <el-card class="box-card-update" style="width: auto">
          <div slot="header" class="box-card-title">
            <el-badge value="" class="item">
              <span>2019-3-4 更新内容 </span>
              <el-button type="text" @click="showUpdate20190304 = !showUpdate20190304">展开查看详情</el-button><br />
            </el-badge>
          </div>
          <div v-if="showUpdate20190304" style="font-size: 14px;">
           <pre>
             <b>财务中心优化</b>
             1.现在财务可以直接补录 [还款记录] 和 [借款记录],用于补平员工的总借款和总还款数据.
             2.使用归并算法,应收账款里现在可 [统计显示员工的总借还金额]
             3.修复银行流水页面的自动合计金额BUG

             <b>报销系统优化</b>
             1.为了方便 [报销记录] 到 [报销申请] 两个表的双向追溯,报销记录表已关联报销申请表
             2.报销记录表新增 [生成类型] 表项,可区分该记录是 [补录] 还是 [申请]
             3.所有报销记录已关联凭证编号
             4.报销记录三个页面(综合/基础/物资)都新增了更丰富的搜索功能!界面优化!
             5.结算记录中也新增了 [生成类型] 表项,可区分该记录是 [补录] 还是 [申请]
           </pre>
          </div>
        </el-card>
        <el-card class="box-card-update" style="width: auto">
          <div slot="header" class="box-card-title">
              <span>2019-2-26 更新内容 </span>
              <el-button type="text" @click="showUpdate20190226 = !showUpdate20190226">展开查看详情</el-button><br />
          </div>
          <div v-if="showUpdate20190226" style="font-size: 14px;">
           <pre>

             <b>报销系统 - 我的申请</b>
             现在创建申请时可点击 [实际已付款] 按钮,将自动在备注栏里添加'实际已付款'五个字
             这样在审批时,用以区分哪些是财务实际上已经打款了

             <b>财务中心 - 开票审批 </b>
             现在财务部可以修改发票号/实际开票时间

             <b>开票系统</b>
             开票单位 已更名为 客户名称

             <b>修复BUG</b>
             1.修复部分页面在进行数值计算的显示时,小数位计算错误
             例如:1.2-0.1=1.099999999

           </pre>
          </div>
        </el-card>
        <el-card class="box-card-update" style="width: auto">
          <div slot="header" class="box-card-title">
              <span>2019-2-25 更新内容 </span>
              <el-button type="text" @click="showUpdate20190225 = !showUpdate20190225">展开查看详情</el-button><br />
          </div>
          <div v-if="showUpdate20190225" style="font-size: 14px;">
           <pre>
            <b>新增分公司: 华建云南 (原华建电力设计云南项目部)</b>
             现已将云南项目部单独作为分公司体现 , 并在核算系统中进行单独计算并显示.

             <b>经营管理 - 我的任务 </b>
             现在默认显示 待开票项目 , 也可以切换到 已开票项目

             <b>经营管理 - 项目管理 </b>
             修复经营负责人显示为数字的BUG , 现在选择经营负责人时搜索结果里将只显示经营部员工 , 提升选择效率.
<<<<<<< HEAD

             <b>生产管理 - 生产审批 </b>
=======
             <b>生产管理 - 生产审批</b>
>>>>>>> hzp
             经营管理新增:生产审批模块,在模块中新增用工申请和劳务付款申请.
             用工申请实现了报表输出,用工申请实现创建,到生产公司负责人审批,以及最终的负责人审批功能
             劳务结算流程实现了报表输出,劳务结算流程实现创建,到生产公司负责人审批,以及最终的负责人审批功能
           </pre>
          </div>
        </el-card>
        <el-card class="box-card-update" style="width: auto">
          <div slot="header" class="box-card-title">
            <span>2019-2-20 更新内容 </span>
            <el-button type="text" @click="showUpdate20190220 = !showUpdate20190220">展开查看详情</el-button><br />
          </div>
          <div v-if="showUpdate20190220" style="font-size: 14px;">
           <pre>
            <b>财务审批</b>

             财务主管现在可以在修改申请申请信息时修改报销金额.

             <b>凭证打款</b>
              1.现在显示报销人/申请人
              2.现在可以查询报销人/申请人
              3.新增银行管理,可以新增银行账户,停用账户,修改账户信息

           </pre>
          </div>
        </el-card>
        <el-card class="box-card-update" style="width: auto">
          <div slot="header" class="box-card-title">
              <span>2019-2-14 更新内容 </span>
              <el-button type="text" @click="showUpdate20190214 = !showUpdate20190214">展开查看详情</el-button><br />
          </div>
          <div v-if="showUpdate20190214" style="font-size: 14px;">
           <pre>
            <b>报销审批页面用户体验优化</b>

             审批页面 : 现在在勾选您想要查看的表项后,可以点击 [记住我的选项] 按钮

             下次访问该页面将自动读取您记住的选项,任何人都可以根据自己的需求自定义要显示的表项.

             <b>BUG修复</b>
             1.修复 综合报销-报销记录 无法筛选查询
             2.修复 审批页面 选择搜索时按回车无法直接查询
             3.修复 财务审批页面 当申请被前四级拒绝后,财务审批状态显示为待审批而非已拒绝

           </pre>
          </div>
        </el-card>
        <el-card class="box-card-update" style="width: auto">
          <div slot="header" class="box-card-title">
              <span>2019-1-27 更新内容 </span>
              <el-button type="text" @click="showUpdate20190127 = !showUpdate20190127">展开查看详情</el-button><br />
          </div>
          <div v-if="showUpdate20190127" style="font-size: 14px;">
         <pre>
            <b>报销申请系统优化更新</b>
            【创建申请】
            1.由于报销申请经常出现报销单号填重复、总条数填错的情况
            （财务那边的反馈，几乎每10条就有1条在填写时出错）
            因此在我的申请页面新增一个功能按钮：[创建报销单]

            2.创建报销单只是在形式上简化了填写申请的方式，
            比如一条纸质报销单过去要创建五条申请，而现在直接创建报销单，
            在一个页面下填写完毕后一次性创建即可。
            具体的界面非常简单明了，一个报销单页面下可以添加无数条申请。

            3.这种形式，首先不需要重复填写报销单号、报销人，也不需要填写总条数了
            (系统根据你填写的申请条数自动识别总条数）

            4.其次，我还提供了一个按钮：自动生成报销单号，这个功能将根据制单人所在分公司或部门，
            自动生成系统中该部门最新的编号，不可能存在重复的情况。彻底解决编号出错问题。

            5.需要注意的是，由于是创建报销申请单，因此一个报销单下的申请必须一次性填完。
            在一个报销单下的某条申请被异常拒绝后，需要用原来的方式：创建单条申请 来将这条被拒绝的申请重建

            【优化】
            1.我的申请页面，现在会显示更宽大更优化的界面和表格，各位自行查看便知。
            2.待我审批页面，现在会合并项目和分组，减少横向的空间占用。
            3.在表项的默认显示设置也有一些些改动，主要是来自于各位的使用反馈来调整的。

          </pre>
          </div>
        </el-card>
        <el-card class="box-card-update" style="width: auto">
          <div slot="header" class="box-card-title">
              <span>2019-1-24 更新内容 </span>
              <el-button type="text" @click="showUpdate20190124 = !showUpdate20190124">展开查看详情</el-button><br />
          </div>
          <div v-if="showUpdate20190124" style="font-size: 14px;">
         <pre>
            <b>财务中心</b>
            1.应收账款和还款系统上线!

              ①财务出纳人在凭证打款页面可以对某个报销单点击 抵借  按钮,即可选择对应的借款记
                录,然后确认抵消借款.
              ②在财务报表->应收账款页面,即可看到本公司的综合应收账款和项目应收账款,以及应收
                账款的已收金额,然后还可以查看某笔应收账的所有还款记录.
              ③应收账款包括: 工人借款 职员借款 保证金 押金
              ④抵消借款后,凭证的状态变为 已抵借 ,无需填写银行信息,也不会显示在银行流水里.

            2.修复BUG : 银行流水在显示收付人时,会显示报销单中被取消的报销申请的报销人.现在已
              修复,所有报销申请被取消后,报销单号自动加上[CANCEL]前缀.

            3.修复BUG : 凭证操作之前会对已取消的报销申请同样起作用,现已修复.并已后台移除所有
              之前错误生成的报销记录.

            4.凭证打款页面现在会显示报销人姓名了.
          </pre>
          </div>
        </el-card>
        <el-card class="box-card-update" style="width: auto">
          <div slot="header" class="box-card-title">
              <span>2019-1-21 更新内容 </span>
              <el-button type="text" @click="showUpdate20190121 = !showUpdate20190121">展开查看详情</el-button><br />
          </div>
          <div v-if="showUpdate20190121" style="font-size: 14px;">
         <pre>
            <b>财务中心</b>
                1.银行流水 现在可以按凭证编号排序了
                2.财务部在我的申请页面可创建和导入财务申请,无需部门审批.(仅财务部可见可用)

            <b>修复BUG:</b>
            1.修改报销申请的报销人时,也会同步更新审批流程.
            2.修改报销申请的金额时,也会同步更新判断是否需要唐总审批.
            3.改写了批量审批的方法,避免极小概率会出现批量审批时同一个报销单,生成多个凭证.

           <b>开票与收款系统流程说明:</b>

            1.经营部需将项目分配给至少一个,至多三个经营负责人(在项目管理中可设置)
            2.经营负责人在我的任务页面,可看到所有分配给自己的项目
            3.经营负责人可对项目进行申请开票/撤销开票/修改开票申请信息/创建收款/撤销收款/修改收款信息
            4.经营负责人对项目申请开票
            5.经营部主管在开票管理页面对开票申请进行审批,可同意或拒绝(拒绝需填写原因)
            6.财务部在金额往来->开票申请页面可对所有申请进行审批并确认开票.
              如果审批并开票,则点击开票,并填写发票号. 如果有问题,不开票,则拒绝,并填写拒绝原因.
              (发票号必须在此处填写,后续无法补填)
            7.开票申请被财务审批后,经营部负责人可以在我的任务中,对该发票进行创建收款.
            8.如果是无票收款,则不需要创建开票申请,直接点击无票收款即可.
            9.创建收款后,依然需要等待财务确认.
            10.财务部在金额往来->收款确认页面可对所有收款进行确认.
            11.确认后该笔收款将立即生效,更新到项目的总收款金额中.
            12.当前系统有且仅有梁冬妮可在收款管理里,对具体的某笔收款金额进行修正.
            13.如遇棘手问题,请私聊我后台处理.

            本系统暂未在开票时扣除开票税金,因此需要另外作为一笔财务报销录入系统.
            收款确认页面暂不支持拒绝确认的功能,因此如果财务部发现有收款申请并不能确认,那么可放置暂时不管.
            如果已明确是填错了后其他情况,直接让经营部负责人取消该收款申请即可.
          </pre>
          </div>
        </el-card>
        <el-card class="box-card-update" style="width: auto">
          <div slot="header" class="box-card-title">
            <span>2019-1-16 更新内容 </span>
            <el-button type="text" @click="showUpdate20190116 = !showUpdate20190116">展开查看详情</el-button><br />
          </div>
          <div v-if="showUpdate20190116" style="font-size: 14px;">
         <pre>
            1.项目现在需要指定至少一个经营部负责人,用于后续的任务分配模块(正在开发)
            2.项目管理页面界面优化
            3.修复BUG:该BUG导致导入报销申请时,因为报销单号字符超过10个字符而无法导入!
          </pre>
          </div>
        </el-card>
        <el-card class="box-card-update" style="width: auto">
          <div slot="header" class="box-card-title">
            <span>2019-1-11 更新内容 </span>
            <el-button type="text" @click="showUpdate20190111 = !showUpdate20190111">展开查看详情</el-button><br />
          </div>
          <div v-if="showUpdate20190111" style="font-size: 14px;">
         <pre>
            1.页面的搜索项现在支持直接按回车键 查询
            2.财务审批的报销单号支持一键复制
            3.凭证选择银行时选项颜色加深
            4.凭证打款界面支持用总金额搜索
            5.修复审批后自动生成报销失败的BUG
            6.凭证打款页面增加 查看未填银行凭证 查看未填凭证号 功能按钮
            7.编辑凭证时,打款时间默认显示当前时间,无需再手动选择时间,提升效率
            8.编辑凭证时,选择银行时支持模糊搜索/支持按拼音大写或小写模糊搜索:如搜宝安,即输入ba或BA
            9.编辑凭证时可以 填写 或 修改 打款备注
          </pre>
          </div>
        </el-card>
        <el-card class="box-card-update" style="width: auto">
          <div slot="header" class="box-card-title">
            <span>2019-1-10 更新内容 </span>
            <el-button type="text" @click="showUpdate20190110 = !showUpdate20190110">展开查看详情</el-button><br />
          </div>
          <div v-if="showUpdate20190110" style="font-size: 14px;">
         <pre>
            1.报销申请中从19年1月份起的报销单号完成补录并生成凭证
            注意：所有我从后台补录的报销单号的后尾都有一个B字母，表示（补）。
            2.修复BUG：待审申请、财务审批页有时按时间排序无效、报销单号凭证编号无法模糊搜索
            3.修复BUG：综合报销、项目报销页创建报销记录时部分报销人选不了
          </pre>
          </div>
        </el-card>
        <el-card class="box-card-update" style="width: auto">
          <div slot="header" class="box-card-title">
            <span>2019-1-8 更新内容 </span>
            <el-button type="text" @click="showUpdate20190108 = !showUpdate20190108">展开查看详情</el-button><br />
          </div>
          <div v-if="showUpdate20190108" style="font-size: 14px;">
         <pre>
            <b>整体优化：</b>
            1.现在展开侧边栏菜单时，会自动收缩其他被展开的菜单，解决菜单栏太长的种种不方便
            2.登录页背景美化：现在会展示轮播图
            3.注意：如果不想要登录时被浏览器记住密码，请先清空浏览器缓存,然后当浏览器提示是否需要记住本页面的密码时，请点否，然后刷新页面，就再也不会记住密码了。

            <b>综合行政的报销系统改版：</b>

            <b>补填工作：由于报销申请新增了两个字段：报销单号 和 申请总数，因此需要将系统已有的所有申请补填报销单号。具体怎么补填待商讨.
                     格式为项目部指定的报销单编号规则
                     申请总数 就是 一个报销单中所有的申请的数量，一定不要填错。一般是1-5条（因为报销单只填的下5条）。</b>

            1.财务审批页面搬移到财务中心（和报销审批同级）
            2.原审批管理下的 待我审批 和 审批流程 直接移到 报销审批 下，不再有 审批管理 这一层。
            3.我的申请页面，创建申请和导入申请时，需要额外填写：报销单号（根据相关规范来命名）、申请总数
            4.待审申请和财务审批页面新增了 报销单号 的搜索功能
            5.待审申请和财务审批表格新增了 报销单号 的列，并且在单号后面会显示这个报销单一共有多少条申请。
            6.财务审批页面不再提供打款操作（如果要补填凭证编号，需要在凭证打款页面补填）
            7.财务中心下新增凭证打款页面，出纳人在该页面进行打款。无需再对每条申请进行打款了。
            8.出纳人可对凭证进行三种操作：编辑、打款、异常
            9.编辑：可修改打款时间、选择打款银行、单位、账号、填写凭证编号（凭证编号可以点击系统生成）
            10.打款：点击确认已打款即可将凭证中的所有申请全部打款，并且生效生成报销记录。同时生成打款时间。
            11.异常：填写异常原因，点击确认异常后该报销单下的所有申请都会异常。需要申请人重新创建申请。

            <b>报销申请从创建到生成凭证的逻辑过程 :  </b>
            1.申请人现在创建申请时需要录入 报销单号 和 申请总数，同时在纸质报销单上备注报销单号，无需再备注ID
               注1：报销单号编号规则：公司+年份+月份+序号 （例如：HJ19010001）
               注2：报销总数就是这个报销单下一共有多少条申请
            2.当财务审批人在审批每一条申请时，系统自动检测报销单下所有申请是否通过并且通过数量等于填写的报销总数
            3.如果都通过了说明这个报销单已经全部审批完成,那么系统会自动整合所有申请生成一条报销凭证
               如果通过数量大于填写的报销总数（申请总数填少了），那么不会生成凭证。
               如果通过数量小于填写的报销总数（申请总数填多了），那么不会生成凭证。
               这时候只能等申请人发现自己的申请一直没有打款后，联系系统管理员修正数据。
            4.出纳人在凭证打款页面就可以看到一条条凭证了,然后对凭证进行打款即可.
            5.如果打款异常，那么整个报销单下的所有申请都是异常，需要重新发起。

            <b>修复BUG：</b>
            1.当一个项目在结算中心没有创建结算时，工人付款类的申请被打款后无法生成结算记录。现在会在付款时检测这个项目是否创建了结算，否则无法打款。
            2.财务有时无法审批的小BUG已修复。
            3.修复财务无法修改实际科目的BUG
            4.修复财务审批或修改后页面刷新错误

            <b>文字优化：</b>
            1.由于富华和源通的结算中心几个按钮和提交窗口取名比较模糊，导致很容易搞混淆.
              因此优化了命名。现在会显示创建项目结算条目、新增工人结算记录、修改工人结算记录、修复项目分包属性。
              同时在权限里也更新了相关文字，以免造成混淆，无法区分。
          </pre>
          </div>
        </el-card>
        <el-card class="box-card-update" style="width: auto">
          <div slot="header" class="box-card-title">
            <span>2019-1-3 更新内容 </span>
            <el-button type="text" @click="showUpdate20190103 = !showUpdate20190103">展开查看详情</el-button><br />
          </div>
          <div v-if="showUpdate20190103" style="font-size: 14px;">
         <pre>
            1.修复BUG：报销审批表格可正常显示凭证号
            2.修复BUG：财务修改申请内容时，可修改面单科目和实际科目
            3.打款操作栏新增填号按钮，用于填入凭证号
            4.修复BUG：权限列表文字描述修正
            5.修复BUG：权限分组中正常显示报销分组相关权限
            6.修复BUG：ID可正常搜索
            7.修复BUG：已异常类型的表格显示
          </pre>
          </div>
        </el-card>
        <el-card class="box-card-update" style="width: auto">
          <div slot="header" class="box-card-title">
            <span>2018-12-29 更新内容 </span>
            <el-button type="text" @click="showUpdate20181229 = !showUpdate20181229">展开查看详情</el-button><br />
          </div>
          <div v-if="showUpdate20181229" style="font-size: 14px;">
         <pre>
           <b>审批管理-待审申请/财务审批：</b>

            1. UI重做，全层次美化，极大提升用户体验
            2. 表格中的勾选框、详情、操作栏将漂浮固定在表格左侧，便于操作
            3. 展开详情优化，按钮改为蓝色背景，详情展开页改为淡黄色背景并优化布局
            4. 所有需要加载的地方都添加了加载动画，提升用户体验。
            5. 新增批量审批通过功能，批量勾选后自动合计金额功能
            6. 新增一级、二级、三级、四级审批时间，新增财务审批、财务打款时间
            7. （注意，由于之前的数据是没有审批时间的，因此系统统一填为2018-01-01）
            8. 新增按审批时间来排序（正序/倒序）
            9. 财务审批时切换待审批则显示审批操作栏，切换待打款则显示打款操作栏
            10. 财务审批时审批通过时不再需要填写备注
            11. 财务审批表格高亮显示颜色优化，降低颜色深度
            12. 修复BUG：待我审批表格错误地显示待我审批但之前已经被拒绝的申请
            13. 优化审批后页面刷新：现在会正确的根据您当前页面的现状来刷新页面，以保证不会影响您后续的审批操作。

           <b>成本核算</b> -

            1. 优化用户体验，现在网速较慢时，在更新核算、搜索查询、查看明细、切换页面时会显示加载动画。
            2. 新增按合计金额进行排序（正序/倒序）
          </pre>
          </div>
        </el-card>
        <el-card class="box-card-update" style="width: auto">
          <div slot="header" class="box-card-title">
            <span>2018-12-27 更新内容</span>
            <el-button type="text" @click="showUpdate20181227 = !showUpdate20181227">展开查看详情</el-button><br />
          </div>
          <div v-if="showUpdate20181227" style="font-size: 14px;">
         <pre>
           <b>审批流程</b> - 新增总经办的审批流程(吴迪-吴迪-吴迪-唐睿)<br />

           <b>我的申请</b> -
           1.修复BUG:原申请的金额小于3000,当修改为大于3000后，审批流程依旧是三级，因此该申请会导致系统在我的申请和待我审批页面显示错误，造成页面异常，<a style="color: #b94a48">现在修改金额大于3000元后，会自动增加四级审批。</a>
           2.现在会在申请详情里显示审批<a style="color: #b94a48">被拒绝的原因</a>！

           <b>待审申请</b> -
           1.表格可显示<a style="color: #b94a48">用途</a>了，同时用途也可以勾选在表格中不显示。
           2.表格可显示<a style="color: #b94a48">拒绝原因</a>了,勾选 显示拒绝原因 即可在表格中显示!
           3.搜索功能修复，现在可正常搜索面单科目和实际科目了。
           4.搜索功能更新，现在可以对<a style="color: #b94a48">ID区间</a>进行搜索了，比如搜索申请ID大于10，小于50的所有申请。
           5.审批功能更新，现在如果您同时是一级二级/一级二级三级/二级三级的审批人，那么您将可以<a style="color: #b94a48">一键同时审批</a>，不再需要您多次点击审批了!
           6.拒绝功能更新，现在如果您拒绝了申请，那么可以<a style="color: #b94a48">填写拒绝原因</a>。
           7.优化审批，现在审批后，页面会停留在审批时的页面，而不会刷新到初始页。比如说我在第2页进行审批，审批后页面会依旧停留在第2页。
           8.优化搜索，现在可以通过分公司进行筛选了。

           <b>财务审批</b> -
           1.表格可显示<a style="color: #b94a48">用途</a>了，同时用途也可以勾选在表格中不显示。
           2.条件搜索功能更新优化。
           3.对表项进行显示/隐藏的选择框更新优化为两行。
           4.在页面左上方，新增按钮 <a style="color: #b94a48">[点击查看详细使用说明]</a> ，您可以查看财务审批的全面详细说明，包括功能/词语解释等。
           5.优化审批，现在审批后，页面会停留在审批时的页面，而不会刷新到初始页。比如说我在第2页进行审批，审批后页面会依旧停留在第2页。
           6.优化搜索，现在可以通过分公司进行筛选了。

          </pre>
          </div>
        </el-card>
        <el-card class="box-card-update" style="width: auto">
          <div slot="header" class="box-card-title">
            <span>2018-12-21 更新内容</span>
            <el-button type="text" @click="showUpdate20181221 = !showUpdate20181221">展开查看详情</el-button><br />
          </div>
          <div v-if="showUpdate20181221" style="font-size: 14px;">
         <pre>
            <b>审批流程</b> -华建集团流程拆分为综合部/项目部/经营部三个流程

            <b>待审申请</b> -添加ID搜索功能

            <b>我的申请</b> -Excel导入模板修复

            <b>员工设置</b> -在源通电力下创建部门 外协 ,导入外包工人员工到外协中
          </pre>
          </div>
        </el-card>
        <el-card class="box-card-update" style="width: auto">
          <div slot="header" class="box-card-title">
            <span>2018-12-20 更新内容</span>
            <el-button type="text" @click="showUpdate20181220 = !showUpdate20181220">展开查看详情</el-button><br />
          </div>
          <div v-if="showUpdate20181220" style="font-size: 14px;">
         <pre>
    <b>首页</b> 添加个人快捷导航（可一键访问我的任务、我的申请、我的权限、修改密码等）、增加版本号和更新内容。

    <b>综合行政</b>
    1.报销科目：报销科目已支持修改，有修改权限的用户可以对某个报销科目的名称和涉及费用明细进行修改，但是报销科目的名称必须确保唯一不可重复。
    2.报销记录/基础报销/物资采购表格中新增有效值显示，当有效值为1为正常，为0时表示这条记录被删除。
    3.报销记录/基础报销/物资采购表格中新增回收站，点击查看回收站可以查看删除的报销记录。
    （后续会更新删除报销记录的功能，有权限的用户就可以选择删除某条记录了，但该记录并不是真正的删除，而只是为无效状态，有效值变为0。）
    4.报销分组的分组报销金额综合只计算有效值为1的报销记录。

    <b>项目核算</b> 成本核算 只核算有效值为1的报销

    <b>系统设置</b>
    1.员工设置，新增员工状态筛选，可以筛选出在职和离职状态。
    2.员工权限，新增表格新增员工状态项，同时新增员工状态筛选，可以筛选出在职和离职状态。
    3.权限分组，新增分组-无权限组，请将离职员工、外包工人等用户放到此权限组。

    <b>本次主要更新板块：</b> 综合行政-报销审批

    <b>报销审批系统功能简述：</b>
      1.在我的申请页面创建四类报销申请（综合报销、基础报销、物资采购、工人付款），申请的表单内容和报销记录相差无异。
      2.然后系统根据你所填的分组或者项目所属的分公司，自动分配该公司的审批流程中的四个层级的审批人，
      3.在四个层级的审批人审批同意后，再由财务审批人进行最终审核，审批通过后等待财务出纳人去银行打款。
      4.打款后出纳人确认已打款后，该条申请会自动存到对应的报销系统里，例如综合报销就存到综合报销记录里。

    <b>本系统主要有四个页面：</b>

    1.我的申请：
      ①该页面可创建申请，可批量Excel导入申请，在申请还未被一级审核人审核时，可以修改申请的，或者可以撤回申请。（注意，撤回后该申请将不再支持恢复）
      ②只要某条申请是你创建的或者报销人是你，那么你就可以在本页看到这条申请，并有权进行修改和撤回。同时也可以看到申请的详情和审批状态。
      ③批量导入的模板与综合报销的模板相差无几，只是凭证号变成了申请类型。有权限的用户（各公司的综合部）可以执行批量导入申请。

    2.审批管理-待审申请：
      ①待审申请页面主要是显示待你审批、你已经审批的申请（有权限的用户可以看到全公司所有申请）
      ②如果你是某条申请的审批人，那么你就需要在这个页面审批员工的申请，但是必须要这个申请的审批状态达到你所在的审批层级时才可以审批。
      （比如某条申请有三级审批，你第三级，那么只有该申请前两级都通过了你才能审批）
      （你可以审批的申请会显示[通过][拒绝]按钮，你不能审批的就不会显示）
      ③该页面有丰富的筛选功能，无论是从项目名称、报销人、申请人、申请时间、科目、申请类型来查询，还是勾选显示隐藏（显示项目、显示分组、显示面单科目、显示实际科目等等）
      ④因为页面的头部占用的空间较大，增加了[收起]按钮，在屏幕右侧，点击可以收起头部，增加表格空间。

    3.审批管理-审核流程
      ①审批流程以公司为基础分类五类：集团、华建电力、富华、源通、物联，每个分公司都有一套审批流程（四层级审批人）。
      ②在本页面有权限的用户可以修改某个公司的审批流程。（但是修改后只会影响到你修改后创建的申请的流程，已经创建的是不会更新的！）
      ③注意，当申请报销的金额小于等于5000元时，审批只有三级。大于5000元时有四级审批（唐总）。

    4.财务审批
    ① 本页为财务部进行最终审批/校正/拨款的页面!
    ② 本页面的选择器可供显示六个类型的表格：
        1.待财务审批的申请 2.已经被财务审批的申请 3.等待财务打款的申请 4.已经打款的申请 5.被财务处理为异常的申请 6.全公司所有申请
    ③ 全公司采用固定的财务审批人，在本页面只有财务审批人可以对申请进行 修改、同意、异常 三种操作。
    ④ 全公司采用固定的财务出纳人，在本页面只有财务出纳人可以对申请进行 打款、异常 两种操作。
    ⑤ 只有当申请被审批到财务这里时，才会显示在待审批表格中。
        财务可以对申请的内容进行修改，可以审批同意（审批同意时，可以填写备注信息），也可以审批为异常（可以填写异常原因），当审批为异常时，申请将终止，必须重新创建申请。
    ⑥ 只有当申请被财务审批同意后，才会显示在待拨款表格中。
        财务出纳人可以对待拨款申请进行 [已打款] 或 [异常] ，当出纳人实际打款后，就点击已打款按钮（需要填写凭证号），一旦确认已打款，该申请将自动生效，存到报销系统里。
    （比如综合报销申请就会存到综合报销记录里，基础报销申请就会存到项目报销-基础报销里，工人付款申请就会存到结算中心-结算记录里。）
    ⑦ 财务确认打款后，可能会出现银行实际没打款成功，可能由于卡号错误等，这个时候，出纳人可将该申请再次审批为异常状态，并填写异常原因。
      届时，该申请将自动从报销系统里自动转入回收站并失效，工人付款类的会自动删除那条付款记录。
    </pre>
          </div>
        </el-card>
        <el-card class="box-card-update" style="width: auto">
          <div slot="header" class="box-card-title">
            <span>2018-12-19 更新内容</span>
            <el-button type="text" @click="showUpdate20181219 = !showUpdate20181219">展开查看详情</el-button><br />
          </div>
          <div v-if="showUpdate20181219" style="font-size: 14px;">
          <pre>
            综合行政-报销分组:
            1.增加分页功能
            2.增加快捷查询关键词:全部/综合管理部/经营部/项目部/2018年12月/2019年1月等
            3.修复无法创建分组的bug

            综合行政-报销记录/基础报销/物资采购:
            1.表格增加两项: 凭证号(非必填) / 实际科目(必填) , 原报销科目 更名 面单科目!
            2.显示隐藏选择框增加四项: 显示凭证号 /  显示实际科目 / 显示面单科目 / 显示录入人
            3.Excel导入表格模板更换为 通用 模板!
            4.三表统一表头,共11项(*面单日期、凭证号、*分组名称、*报销人、*分公司、*报销类型、*金额、*用途、*实际科目、*面单科目、备注)
            5.不再根据项目和分组自动从后台获取分公司,而是根据你填的分公司来存储.
            6.用途和备注不再限制字数.避免字数过长导入失败.
            (源通电力下的物资采购页面只供查看,暂时移除添加功能)

            经营管理和综合行政下的导航栏图标更新

            系统右上角新增 切换全屏F11 的按钮!
          </pre>
          </div>
        </el-card>
      </div>

    </div>
  </div>
</template>

<script>
  import { getView } from '../../api/user'
  import { getWorkerApplyTotal } from '../../api/workerApply'
  import { getPayApplyTotal } from '../../api/payApply'
  import { getTotal } from '../../api/proof'
  import { getApprovedTotal, getFinanceTotal } from '../../api/costApply'

  export default {
    data() {
      return {
        name: 'Tony',
        user_department_id: null,
        showUpdate20181220: false,
        showUpdate20181219: false,
        showUpdate20181221: false,
        showUpdate20181227: false,
        showUpdate20181229: false,
        showUpdate20190103: false,
        showUpdate20190108: false,
        showUpdate20190110: false,
        showUpdate20190111: false,
        showUpdate20190116: false,
        showUpdate20190121: false,
        showUpdate20190124: false,
        showUpdate20190127: false,
        showUpdate20190214: false,
        showUpdate20190220: false,
        showUpdate20190225: false,
        showUpdate20190226: false,
        showUpdate20190304: false,
        showUpdate20190311: false,
        showUpdate20190312: false,
        showUpdate20190320: false,
        showUpdate20190322: true,
        useWorkerCount: null, // 用工申请待审核
        payCount: null, // 付款审批待
        waitCount: null, // 待工人考核数
        waitApplyCount: null, // 待我审批(四级)
        waitApplyCount_Fin: null, // 待我审批(财务)
        waitPayingProofCount: null // 待打款凭证数
      }
    },
    methods: {
      fetchWorkerApplyTotal() {
        getWorkerApplyTotal({ myId: this.$store.getters.userId }).then(res => {
          this.useWorkerCount = res.data
        })
      },
      fetchPayApplyTotal() {
        getPayApplyTotal({ myId: this.$store.getters.userId }).then(res => {
          this.payCount = res.data
        })
      },
      /** 获取待考核申请*/
      fetchWaitApprovalTotal() {
        getWorkerApplyTotal({ waitApproval: 1 }).then(res => {
          this.waitCount = res.data
        })
      },
      fetchWaitApplyTotal() {
        getApprovedTotal().then(res => {
          this.waitApplyCount = res.data
        })
      },
      fetchWaitApplyTotal_fin() {
        getFinanceTotal().then(res => {
          this.waitApplyCount_Fin = res.data
        })
      },
      fetchWaitProofTotal() {
        getTotal().then(res => {
          this.waitPayingProofCount = res.data
        })
      },
      clickMe() {
        console.log('res', 'i am tony')
      },
      onQuick(params) {
        switch (params) {
          case '1':
            this.$router.push({ name: 'HomeMyTask' })
            break
          case '2':
            this.$router.push({ name: 'fuHuaMyTask' })
            break
          case '3':
            this.$router.push({ name: 'HuaJianMyTask' })
            break
          case '4':
            this.$router.push({ name: 'yuanTongMyTask' })
            break
          case '5':
            this.$router.push({ name: 'myApply' })
            break
          case '6':
            this.$router.push({ name: 'accessList' })
            break
          case '7':
            this.$router.push({ name: 'SettingPassword' })
            break
          case '8':
            this.$router.push({ name: 'applyAll' })
            break
          case '9':
            this.$router.push({ name: 'marketMyTask' })
            break
          case '10':
            this.$router.push({ name: 'applyAllFin' })
            break
          case '11':
            this.$router.push({ name: 'invoiceApply' })
            break
          case '12':
            this.$router.push({ name: 'proofCreate' })
            break
          case '13':
            this.$router.push({ name: 'receiptConfirmation' })
            break
          case '14':
            this.$router.push({ name: 'marketInvoice' })
            break
          case '15':
            this.$router.push({ name: 'MyApproval' })
            break
          case '16':
            this.$router.push({ name: 'EmploymentApplication' })
            break
          case '17':
            this.$router.push({ name: 'Payment' })
            break
          case '18':
            this.$router.push({ name: 'ApprovalSet' })
            break
          default:
            this.$router.push({ name: 'HomeIndex' })
        }
      },
      // 获取用户的部门,根据部门显示不同的导航板块
      checkDepartment() {
        getView({ 'id': this.$store.getters.userId }).then(res => {
          this.user_department_id = res.data.department_id
        })
      }
    },
    mounted() {
      this.checkDepartment()
      this.fetchWorkerApplyTotal()
      this.fetchPayApplyTotal()
      this.fetchWaitApprovalTotal()
      this.fetchWaitApplyTotal()
      this.fetchWaitApplyTotal_fin()
      this.fetchWaitProofTotal()
    }
  }
</script>
<style>
  .home-index .box-card {
    background-color: #fff;
    white-space: normal;
    width: 220px;
    margin-bottom: 20px;
    margin-right: 20px;
    text-align: center;
  }
  .home-index-version .box-card-update {
    background-color: #fff;
    white-space: normal;
    width: 220px;
    margin-bottom: 20px;
    margin-right: 20px;
  }
  .box-card-title{
    font-family: Microsoft YaHei,serif;
    color: #1e6abc;
    /*padding-top: 2px;*/
    /*padding-bottom: 2px;*/
  }
  .box-card-quick{
    font-family: Microsoft YaHei,serif;
    color: #1e6abc;
    padding-top: 5px;
    padding-bottom: 2px;
    text-align: center
  }
  .title-name{
    margin:0 auto;
    padding-top: 2px;
    text-align: center;
    font-size: 21px;
    /*text-shadow:0 3px 3px #000;*/
    /*background-color: #66b1ff;*/
    background-image: linear-gradient(to top, #bfe6ff,#fff);
    font-family: Microsoft YaHei,serif;
    color: #f56c6c;
    width: auto;
    height: 70px;
  }
  .version{
    margin-top: 5px;
    font-size: 14px;
    color: #555c66;
  }
  .item {
    margin-right: 10px;
  }
  .el-badge__content.is-fixed {
    right: 15px;
  }
</style>
