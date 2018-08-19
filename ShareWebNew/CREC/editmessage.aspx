<%@ Page Language="c#" CodeBehind="EditMessage.aspx.cs" AutoEventWireup="false" Inherits="Microsoft.Exchange.Clients.Owa.Premium.EditMessage" %>

<%@ Import Namespace="Microsoft.Exchange.Clients" %>
<%@ Import Namespace="Microsoft.Exchange.Clients.Owa.Core" %>
<%@ Import Namespace="Microsoft.Exchange.Clients.Owa.Premium" %>
<%@ Import Namespace="Microsoft.Exchange.Clients.Owa.Premium.Controls" %>
<html<%= IsSMimeControlNeeded ? " xmlns:MIME" : ""%> dir="<%=UserContext.IsRtl ? "rtl" : "ltr"%>">
<head>
<meta http-equiv="Content-Type" content="text/html; CHARSET=utf-8">
<title><% RenderSubject(true); %></title>
<% UserContext.RenderCssLink(SanitizingResponse, Request); %>
<%
	if (IsSMimeControlNeeded)
	{
		RenderScripts("fedtsmime.js", "owaeditor.js", "cattach.js", "smallicons.aspx");
	}
	else
	{
		RenderScripts("fedtmsg.js", "owaeditor.js");
	}
%>
<script type="text/javascript">
	var fEnbSmime = <%=IsSMimeControlNeeded ? 1 : 0 %>;
	var I_LO = <%= ImportanceLow %>;
	var I_N = <%= ImportanceNormal %>;
	var I_HI = <%= ImportanceHigh %>;
	var a_iNit = <%= (int)NewItemType %>;
	var a_fEdtMsg = 1;
	var a_fRichTextEditorSupported = 1; <% /* This is used to let javascript know this aspx file supports the rich text editor.*/ %>
	var a_fTxt = <%=(int)BodyMarkup%>;
	var a_fIsIrmProtected = <%=IsIrmProtected ? 1 : 0 %>;
	var a_fCopyRestricted = <%=IsCopyRestricted ? "1" : "0"%>;
	var a_fPrintRestricted = <%=IsPrintRestricted ? "1" : "0"%>;	
	var a_fRecipientWellRestricted = <%=IsRecipientWellRestricted ? "1" : "0"%>;
	var a_fFromWellRestricted = <%=IsFromWellRestricted ? "1" : "0"%>;
	var a_fWP = <%= UserContext.IsWebPartRequest ? 1 : 0 %>;
<%
    RenderingUtilities.RenderAutoSaveVariables(SanitizingResponse, UserContext);

    if (!IsSMimeControlNeeded)
    {
        RenderDataNeededBySilverlightAttachmentManager();
    }

    RenderingUtilities.RenderThemeUrlVariable(SanitizingResponse, UserContext);
    RenderingUtilities.RenderStringVariable(SanitizingResponse, "L_AttNtPtbl", Strings.IDs.SomeAttachmentsNotProtectable);
    RenderingUtilities.RenderStringVariable(SanitizingResponse, "L_ClsPmpt", Strings.IDs.ClosePrompt);
    RenderingUtilities.RenderStringVariable(SanitizingResponse, "L_Cntnu", Strings.IDs.Continue);
    RenderingUtilities.RenderStringVariable(SanitizingResponse, "L_AddrBk", Strings.IDs.AddressBookEllipsis);
    RenderingUtilities.RenderStringVariable(SanitizingResponse, "L_OtrEml", Strings.IDs.OtherEmailAddressEllipsis);
    RenderingUtilities.RenderStringVariable(SanitizingResponse, "L_ECmplLoad", Strings.IDs.ErrorLoadingComplianceMenuItems);

    if (IsSMimeControlNeeded)
    {
        RenderingUtilities.RenderStringVariable(SanitizingResponse, "L_DrftNtSv", Strings.IDs.DraftWasNotSaved);
        RenderingUtilities.RenderStringVariable(SanitizingResponse, "L_EnWrn", Strings.IDs.EncryptionWarning);
        RenderingUtilities.RenderStringVariable(SanitizingResponse, "L_MsgNtEn", Strings.IDs.MessageCannotBeEncrypted);
        RenderingUtilities.RenderStringVariable(SanitizingResponse, "L_MsgNtSnt", Strings.IDs.MessageCouldNotBeSent);
        RenderingUtilities.RenderStringVariable(SanitizingResponse, "L_NRcpCert", Strings.IDs.NoRecipientCertificatePrompt);
        RenderingUtilities.RenderStringVariable(SanitizingResponse, "L_EMisEncAlgSav", Strings.IDs.ErrorMissingEncryptionAlgorithmsOnSave);
        RenderingUtilities.RenderStringVariable(SanitizingResponse, "L_EMisEncAlgSavFE", Strings.IDs.ErrorMissingEncryptionAlgorithmsOnSaveForceEncrypt);
        RenderingUtilities.RenderStringVariable(SanitizingResponse, "L_EMisEncAlgSnd", Strings.IDs.ErrorMissingEncryptionAlgorithmsOnSend);
        RenderingUtilities.RenderStringVariable(SanitizingResponse, "L_EMisEncAlgSndFE", Strings.IDs.ErrorMissingEncryptionAlgorithmsOnSendForceEncrypt);
        RenderingUtilities.RenderStringVariable(SanitizingResponse, "L_EMisSigAlgSav", Strings.IDs.ErrorMissingSigningAlgorithmsOnSave);
        RenderingUtilities.RenderStringVariable(SanitizingResponse, "L_EMisSigAlgSavFS", Strings.IDs.ErrorMissingSigningAlgorithmsOnSaveForceSign);
        RenderingUtilities.RenderStringVariable(SanitizingResponse, "L_EMisSigAlgSnd", Strings.IDs.ErrorMissingSigningAlgorithmsOnSend);
        RenderingUtilities.RenderStringVariable(SanitizingResponse, "L_EMisSigAlgSndFS", Strings.IDs.ErrorMissingSigningAlgorithmsOnSendForceSign);
        RenderingUtilities.RenderStringVariable(SanitizingResponse, "L_LORW", Strings.IDs.LevelOneReadWrite);
        RenderingUtilities.RenderStringVariable(SanitizingResponse, "L_MsgTooLrg", Strings.IDs.SMIMEErrorMessageSizeExceeded);
        RenderingUtilities.RenderStringVariable(SanitizingResponse, "L_CmpBlk", Strings.IDs.SafeHtmlInfobarCompletelyBlockedMessage);
        RenderingUtilities.RenderStringVariable(SanitizingResponse, "L_NoSmtCdOnSign", Strings.IDs.NoSmartCardAvailableOnSigning);
        RenderingUtilities.RenderStringVariable(SanitizingResponse, "L_NoSmtCdSrvOnSign", Strings.IDs.NoSmartCardServiceOnSigning);
        RenderingUtilities.RenderStringVariable(SanitizingResponse, "L_ErrMaxSMRcp", Strings.IDs.ErrorTooManySMimeRecipients);
        RenderingUtilities.RenderStringVariable(SanitizingResponse, "L_EAttTooLrg", Strings.IDs.ErrorAttachmentFileSizeExceeded);
        RenderingUtilities.RenderStringVariable(SanitizingResponse, "L_AttNmDiv", Strings.IDs.AttachmentNamesDivider);
        RenderSMimeSavingSendingWarnings(SanitizingResponse);
        RenderMessageInformation(SanitizingResponse);
        RenderingUtilities.RenderSmallIconTable(SanitizingResponse, false);
        RenderMaximumUserMessageSize(UserContext, SanitizingResponse);
        RenderDefaultMaximumAttachmentSize(SanitizingResponse);
%>
    var a_fFFWB = <%= ForceFilterWebBeacons ? 1 : 0 %>;
<%
    }
%>
    var a_iSens = <%= MessageSensitivity %>;
	var a_fDvRcp = <%= IsDeliveryReceiptRequested ? 1 : 0 %>;
	var a_fRdRcp = <%= IsReadReceiptRequested ? 1 : 0 %>;
	var a_iABW = <%=AddressBook.PickerDialogWidth%>;
	var a_iABH = <%=AddressBook.WindowHeight%>;
	var a_iT = <%=CurrentStoreObjectType%>;
	var a_IT_RSP = <%=StoreObjectTypeMeetingResponse%>;
	var a_IT_INV = <%=StoreObjectTypeMeetingRequest%>;
	var a_IT_CAN = <%=StoreObjectTypeMeetingCancellation%>;
	var a_IT_APV_RP = <%=StoreObjectTypeApprovalReply%>;
	<% RenderingUtilities.RenderFormatBarState(SanitizingResponse, UserContext); %>
	<% RenderingUtilities.RenderOptionalStringVariable(SanitizingResponse, "a_sInitFntNm", UserContext.UserOptions.ComposeFontName); %>
	var a_sInitFntSz = <%=UserContext.UserOptions.ComposeFontSize %>;
	var a_sDefFntStyl = "<% RenderingUtilities.RenderDefaultFontStyle(SanitizingResponse, UserContext); %>";
	var a_fDefFntBold = <%=(int)(UserContext.UserOptions.ComposeFontFlags & FontFlags.Bold)%>;
	var a_fDefFntItalc = <%=(int)(UserContext.UserOptions.ComposeFontFlags & FontFlags.Italic)%>;
	var a_fDefFntUndl = <%=(int)(UserContext.UserOptions.ComposeFontFlags & FontFlags.Underline)%>;
	var a_fAEnc = <%= OwaRegistryKeys.AlwaysEncrypt ? 1 : 0 %>;
	var a_fASgn = <%= OwaRegistryKeys.AlwaysSign ? 1 : 0 %>;
	var a_fSgn = <%= UserContext.UserOptions.SmimeSign ? 1 : 0 %>;
	var a_fEnc = <%= UserContext.UserOptions.SmimeEncrypt ? 1 : 0 %>;
	var a_iCBS = <%=(int)UserContext.ClientBrowserStatus %>;
	<% if (UserContext.IsFeatureEnabled(Feature.SMime)) { 
		RenderingUtilities.RenderStringVariable(SanitizingResponse, "a_sLV", Utilities.ReadSMimeControlVersionOnServer());
	} %>
	var a_fMstUpd = <%= OwaRegistryKeys.ForceSMimeClientUpgrade ? 1 : 0 %>;
	<% if (AddSignatureToBody)  { %>
	var a_fSig = 1;
	<% } %>
	<% if (IsRequestCallbackForWebBeacons) { %>
		var a_fCbResp = 1;
	<% } %>
	<% if (UserContext.IsFeatureEnabled(Feature.SpellChecker)) { %>
	var a_iSp = <%=UserContext.UserOptions.SpellingDictionaryLanguage %>;
	var a_fSpSn = <%=UserContext.UserOptions.SpellingCheckBeforeSend ? 1 : 0%>;
	var a_fSp = 1;
	<% } %>
	var a_iMaxRcp = <%=OwaRegistryKeys.MaxRecipientsPerMessage%>;
	var a_rgSeg = <%RenderSegmentationBitsForJavascript();%>;
	var a_fIsReplyAllBcc = <%= this.IsReplyAllBcc ? 1 : 0 %>;
</script>
<%
	if (IsSMimeControlNeeded)
	{
		RenderingUtilities.RenderSMimeControl(SanitizingResponse);
		RenderingUtilities.RenderAttachmentBlockingPolicy(SanitizingResponse, UserContext);
	}
%>

<!-- 添加云盘大附件 start-->

<link type="text/css" rel="stylesheet" href="as/styles/main.css">

<!--[if IE 8]>
    <script type="text/javascript" src="as/libs/es5-shim.min.js"></script>
    <script type="text/javascript" src="as/libs/es5-sham.custom.min.js"></script>
<![endif]-->

<script type="text/javascript" src="as/libs/es6-shim.min.js"></script>
<script type="text/javascript" src="as/libs/es6-sham.min.js"></script>
<script type="text/javascript" src="as/libs/es6-promise.auto.min.js"></script>
<script type="text/javascript" src="as/scripts/config.js"></script>
<script type="text/javascript" src="as/scripts/main.js"></script>
<!-- 添加云盘大附件 end -->

</head>
<body class="frmBody<%=UserContext.IsRtl ? " rtl" : ""%>" _PageType="<%=IsSMimeControlNeeded ? "EditSmimeMessagePage" : "EditMessagePage"%>">
<textarea id="txtBdy" class="whPlainText txtBdy" style="display:none">
<% LoadComposeBody(); %></textarea>
<% 
	if (!IsSMimeControlNeeded)
	{
		CreateAttachmentHelpers();
	}
%>
<script type="text/javascript">
<% if (!IsItemNull) { %>
var a_fPmptUsr = <%= ShouldPromptUser ? 1 : 0 %>;
var a_fHasInlineImages = <%= HasInlineImages ? 1 : 0 %>;
<% } %>
<% if (IsItemNull) { %>
	var a_sId = null;
	var a_sCK = null;
<% } else { %>
	var a_sId = "<% RenderJavascriptEncodedItemId(); %>";
	var a_sCK = "<% RenderJavascriptEncodedMessageChangeKey(); %>"; 
	var a_iDltDrft = <%=DeleteExistingDraft ? 1 : 0%>;
	<% if (IsReplyForward) { %>
	var a_sSrcIdQS = "<% RenderJavascriptEncodedSourceItemId(); %>";
	<% } %>
<% } %>
</script>
<% RenderDialogHelper(); %>
<div id="divHdrMessage" class="hdrMessage">
	<div class="ts">
		<%
			if (!IsSMimeControlNeeded)
			{
				RenderSilverlightAttachmentManagerControl();
			}
		%>
		<% this.Toolbar.Render(SanitizingResponse); %>
	</div>

	<% Infobar.Render(SanitizingResponse); %>

	<div id="divWellFrom" class="wellRow" <%= ShowFrom && !IsFromWellRestricted ? "" : " style=\"display:none\"" %> >
		<div id="divFromL" class="wellLabel mwCLbl">
			<a id="btnFrom" class="formHeaderButton <%=UserContext.IsRtl ? "r" : "l"%>" <%RenderOnClick("showFromMenu();");%> _tbb="1" name="lnkB" href="#">
			<div class="hdrBf tbf tbfHvr">
					<span class="tbLh nowrap">
						<%=SanitizedHtmlString.FromStringId(Strings.IDs.FromColon)%>
					</span><%UserContext.RenderThemeImage(SanitizingResponse, ThemeFileId.AlertBarDropDownArrow, "tbLh tbBtwnDD");%>
				</div>
			</a>
		</div>
		<div class="wellWrap">
			<div id="divFieldFrom" class="wellField">
				<% 
					RecipientWell.Render(SanitizingResponse, UserContext, RecipientWellType.From);
				%>
			</div>
		</div>
	</div>
	<div id="divWellTo" class="wellRow" >
		<div id="divToL" class="wellLabel mwCLbl">
			<div id="divToBtn" class="hdrBf tbf <%=IsRecipientWellRestricted ? "tbfD dsbl" : "tbfHvr"%>">
				<a id="btnTo" class="formHeaderButton <%=UserContext.IsRtl ? "r" : "l"%>" <% if (!IsRecipientWellRestricted) { RenderOnClick("shwABM(\"divTo\");"); } %> hidefocus="true" tabindex="-1" _tbb="1" href="#">
					<span class="nowrap">
						<%=SanitizedHtmlString.FromStringId(Strings.IDs.ToEllipsis)%>
					</span>
				</a>
			</div>
		</div>
		<div class="wellWrap">
			<div  id="divFieldTo" class="wellField">
				<% RecipientWell.Render(SanitizingResponse, UserContext, RecipientWellType.To); %>
			</div>
		</div>
	</div>
	<div id="divWellCc" class="wellRow" >
		<div id="divCcL" class="wellLabel mwCLbl">
			<div id="divCcBtn" class="hdrBf tbf <%=IsRecipientWellRestricted ? "tbfD dsbl" : "tbfHvr"%>">
				<a id="btnCc" class="formHeaderButton <%=UserContext.IsRtl ? "r" : "l"%>" <% if (!IsRecipientWellRestricted) { RenderOnClick("shwABM(\"divCc\");"); } %> hidefocus="true" tabindex="-1" _tbb="1" href="#">
					<span class="nowrap">
						<%=SanitizedHtmlString.FromStringId(Strings.IDs.CcEllipsis)%>
					</span>
				</a>
			</div>
		</div>
		<div class="wellWrap">
			<div id="divFieldCc" class="wellField">
				<% RecipientWell.Render(SanitizingResponse, UserContext, RecipientWellType.Cc); %>
			</div>
		</div>
	</div>
	<div id="divWellBcc" class="wellRow" <%= ShowBcc ? "" : " style=\"display:none\"" %> >
		<div id="divBccL" class="wellLabel mwCLbl">
			<div id="divBccBtn" class="hdrBf tbf <%=IsRecipientWellRestricted ? "tbfD dsbl" : "tbfHvr"%>">
				<a id="btnBcc" class="formHeaderButton <%=UserContext.IsRtl ? "r" : "l"%>" <% if (!IsRecipientWellRestricted) { RenderOnClick("shwABM(\"divBcc\");"); } %> hidefocus="true" tabindex="-1" _tbb="1" href="#">
					<span class="nowrap">
						<%=SanitizedHtmlString.FromStringId(Strings.IDs.BccEllipsis)%>
					</span>
				</a>
			</div>
		</div>
		<div class="wellWrap">
			<div id="divFieldBcc" class="wellField">
				<% RecipientWell.Render(SanitizingResponse, UserContext, RecipientWellType.Bcc); %>
			</div>
		</div>
	</div>
	<% if (IsSMimeControlNeeded) { %>
	<div id="divWellSMime" class="wellRow" style="display:none">
		<div id="divSMimeL" class="wellLabel mwCLbl">
		</div>
		<div class="wellWrap">
			<div id="divFieldSMime" class="wellField">
				<% RenderSMimeFromRecipientWell(); %>
			</div>
		</div>
	</div>
	<% } %>
	<div id="divWellSubject" class="subjRow">
		<div id="divSubjL" class="subjLTxtLabel mwCLbl">
			<%= SanitizedHtmlString.FromStringId(Strings.IDs.SubjectColon)%>
		</div>
		<div id="divSubjWrap" class="subjTxtWrap">
			<div id="divFieldSubject" class="txtField">
				<input id="txtSubj" class="txtWell" type="text" maxlength="255" value="<% RenderSubject(false); %>">
			</div>
		</div>
	</div>
	<div id="divWellAttach" class="wellRow"  <%= ShowAttachmentWell ? "" : " style=\"display:none\"" %>  >
		<div id="divAttachL" class="wellLabel mwCLbl nowrap">
			<%=SanitizedHtmlString.FromStringId(Strings.IDs.AttachedColon)%>
		</div>
		<div class="wellWrap rwAttMaxH">
			<div id="divAttachF" class="wellField">
				<% AttachmentWell.RenderAttachmentWell(SanitizingResponse, AttachmentWellType.ReadWrite, AttachmentWellRenderObjects, UserContext); %>
			</div>
		</div>
	</div>

	<div id="divFmtBr">
	&nbsp;
	</div>
	<% if (IsPrintRestricted) { %>
		<div id="divBdyNoPrnt" class="noScreen">
			<%= LocalizedStrings.GetHtmlEncoded(Strings.IDs.PrintRestricted) %>
		</div>
	<% } %>
</div>
<div id=divBdy class="messageBody<%=((int)BodyMarkup == 1) ? " brd" : ""%><%=IsPrintRestricted ? " noPrint" : ""%>">
<%
	if (IsSMimeControlNeeded)
	{
		RenderingUtilities.RenderSMimeEdit(UserContext, SanitizingResponse, true, ForceAllowWebBeacon);
	}
	else
	{
		RenderEditorIframe("w100");
	}
%>
</div>
<%
	if (UserContext.IsFeatureEnabled(Feature.SpellChecker))
		SpellCheckContextMenu.Render(SanitizingResponse);
%>
<% EditorContextMenu.Render(SanitizingResponse); %>
<% ResizeImageMenu.Render(SanitizingResponse); %>
<% RenderEndOfFileDiv(); %>
</body>
</html> 
