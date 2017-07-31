/*

Event scripts go here.   Filename must be UPPERCASE; Filename convention is:

	AAAA;B!C!D!E.js

where:

	AAAA 	= Event Prefix (see EMSE_VARIABLE_BRANCH_PREFIX standard choice, examples are WTUA, CRCA, ASA)
	B		= Module (e.g., LICENSES)
	C		= Application Type, or tilde (~) for wildcard
	D		= Sub-type, or tilde (~) for wildcard
	E		= Category, or tilde (~) for wildcard
	
examples:

	ASA;CASEMANAGEMENT!CASE!~!~
	ASA;LICENSES!AMENDMENT!AE BARB BUSINESS!CLOSE BUSINESS
	ASIUA;CASEMANAGEMENT!CONSUMER COMPLAINT!~!~
	RIUA;LICENSES!~!~!~
	
*/
//without comment notation, this would generate a code error at deployment;
