
import React, { useState, useEffect } from 'react';
import { CallExecution, Agent } from '../types';
import Filters from './call-history/Filters';
import Stats from './call-history/Stats';
import Table from './call-history/Table';
import CallDetails from './call-history/CallDetails';

// Mock Data matching the complex JSON structure provided
const MOCK_EXECUTION_DATA: CallExecution[] = [
    {
        "id": "cab7106a-a34c-4535-9ec7-9ebee14a7355",
        "agent_id": "3f694da8-6c02-41c6-b940-050651e5f662",
        "batch_id": null,
        "created_at": "2025-12-06T02:36:05.826082",
        "updated_at": "2025-12-06T02:37:20.539264",
        "scheduled_at": null,
        "conversation_duration": 72,
        "total_cost": 6.81,
        "transcript": "assistant: Hello. Good evening, this is Poonam from Axilo University. Am I speaking with candidate?\nuser: fasdfa\nassistant:  Hello, thank you for your time. I am calling because you showed interest in the BA. LLB. (Honours) programme at Axilo. May I know what subjects you are currently studying? And are you in twelfth or have you already passed out?\nuser: wetwttrwe\nassistant:  Thank you for sharing. Just to confirm, was your specific choice the BA. LLB. (Honours) programme at Axilo? Applications for the next cycle are currently live, and the next step is the Axilo zap test, which is required for admission and scholarships. Would you like me to share the course details with you now, or would you prefer to receive them via WhatsApp or email?\nuser: ewtwtwewA\nassistant:  No problem. Just to give you a brief idea, the BA. LLB. (Honours) programme is a full five-year integrated law course divided into semesters. It combines humanities, social sciences, and professional legal education. You will get practical training through moot courts, client counselling, drafting exercises, ADR practice, mock trials, expert sessions, and research work.  \n\nAre you aware of the Axilo zap exam? Would you like me to explain it?\nuser: FASFWAET\nassistant:  क्या आप Axilo zap exam के बारे में जानते हैं? क्या मैं आपको इसके बारे में विस्तार से समझाऊँ?\nuser: ASDFWETWAgt\nassistant:  Axilo zap एक scholarship और entrance exam दोनों है, जो admission के लिए जरूरी है। इसमें कुल एक सौ marks होते हैं, कोई negative marking नहीं होती, और qualifying marks कम से कम चालीस होते हैं। आप इसे घर से ऑनलाइन दे सकते हैं, बस कैमरा ऑन रखना होता है, या फिर ऑफलाइन अपने चुने हुए सेंटर पर भी दे सकते हैं। परीक्षा शुल्क पंद्रह सौ रुपये है। क्या आप और जानकारी जानना चाहेंगे?\nuser: wtwgahrh\nassistant:   ठीक है, मैं समझती हूँ। मैं आपको Axilo zap और BA. LLB. programme की पूरी जानकारी WhatsApp या ईमेल पर भेज सकती हूँ। क्या आप मुझे बताएं कि आपको कौन सा माध्यम पसंद होगा?\nuser: agftweat\nassistant:   Axilo के BA. LLB. (Honours) प्रोग्राम की खासियतों में शामिल हैं: मजबूत अकादमिक पाठ्यक्रम, Moot court halls, ADR, client counselling, civil और criminal mock trials, drafting skills, awareness campaigns, यूरोप जैसे देशों में global exposure, प्रसिद्ध वक्ताओं के लेक्चर, और पिछले साल का highest package Twenty-six point seven LPA था। ये सभी आपके practical skills और career prospects को बहुत मजबूत बनाते हैं।  \n\nक्या मैं आपको application payment के बारे में पूछ सकती हूँ? क्या आपका payment पूरा हो गया है?\nuser: atwetwetg\nassistant:  क्या आपका application payment पूरा हो गया है? अगर नहीं, तो क्या मैं जान सकती हूँ कि payment में कोई दिक्कत आ रही है? मैं आपकी मदद कर सकती हूँ, चाहे वह test scheduling हो या scholarship criteria समझना हो।\nuser: wetwetw\nassistant:  अगर आप payment को लेकर unsure हैं, तो मैं आपको बताना चाहती हूँ कि सीटें सीमित हैं, apply करने की आखिरी तारीख पंद्रह अप्रैल है, और Axilo zap टेस्ट बारहवीं की पढ़ाई पर आधारित है। scholarships से आपकी फीस काफी कम हो सकती है, और इस कोर्स के बाद career के अच्छे अवसर मिलते हैं। यह एक सुनहरा मौका है। क्या आप इस बारे में और जानना चाहेंगी?\nuser: qr3qt3qtwegt\nassistant:   ठीक है, आपका समय देने के लिए धन्यवाद। आपका दिन शुभ हो। आप कभी भी हमारी वेबसाइट पर जाकर पूरी जानकारी देख सकती हैं। अगर भविष्य में कोई सवाल हो तो हम आपकी मदद के लिए यहाँ हैं।\n",
        "usage_breakdown": {
            "llmModel": {
                "gpt-4o-mini": {
                    "input": 826,
                    "output": 193
                },
                "azure/gpt-4.1-mini": {
                    "input": 163075,
                    "output": 1620
                }
            },
            "llmTokens": 0,
            "transcriber_model": "nova-3",
            "synthesizer_provider": "elevenlabs",
            "transcriber_provider": "deepgram"
        },
        "cost_breakdown": {
            "llm": 6.807,
            "network": 0,
            "platform": 0,
            "synthesizer": 0,
            "transcriber": 0
        },
        "summary": "The conversation was between a representative from Axilo University and a candidate interested in the BA. LLB. (Honours) program. The assistant provided detailed information about the program structure, practical training components, and the Axilo zap exam, which is required for admission and scholarships. The exam details included a 100-mark test with no negative marking, a minimum qualifying score of 40, an exam fee of 1500 INR, and options to take it online or at a center. The assistant also highlighted the program’s features such as moot courts, ADR, global exposure, and a highest package of 26.7 LPA. The candidate’s responses were unclear, so the assistant offered to send detailed information via WhatsApp or email and inquired about the application payment status and deadlines, emphasizing limited seats and scholarship benefits. The call concluded with the assistant thanking the candidate and inviting them to visit the university website for more information.",
        "status": "completed",
        "user_number": null,
        "provider": "websocket",
        "conversation_type": "websocket",
        "hangup_by": null,
    },
    {
        "id": "exe_829371-b23d-1123",
        "agent_id": "ag_12345",
        "batch_id": "batch_a",
        "created_at": "2025-11-28T10:30:00.000Z",
        "updated_at": "2025-11-28T10:32:00.000Z",
        "scheduled_at": null,
        "conversation_duration": 120,
        "total_cost": 0.12,
        "transcript": "assistant: Hello, how can I help?\nuser: I need support.\nassistant: Sure, what is the issue?",
        "usage_breakdown": {
             "llmModel": {}, "llmTokens": 500, "transcriber_model": "nova-2", "synthesizer_provider": "elevenlabs", "transcriber_provider": "deepgram"
        },
        "cost_breakdown": { "llm": 0.05, "network": 0.01, "platform": 0.01, "synthesizer": 0.04, "transcriber": 0.01 },
        "summary": "User asked for support.",
        "status": "completed",
        "user_number": "+1 555-0101",
        "provider": "plivo",
        "conversation_type": "Inbound",
        "hangup_by": "User"
    },
    {
        "id": "exe_999999-failed-call",
        "agent_id": "ag_12345",
        "batch_id": null,
        "created_at": "2025-11-29T09:00:00.000Z",
        "updated_at": "2025-11-29T09:00:05.000Z",
        "scheduled_at": null,
        "conversation_duration": 0,
        "total_cost": 0.00,
        "transcript": "",
        "usage_breakdown": {
             "llmModel": {}, "llmTokens": 0, "transcriber_model": "", "synthesizer_provider": "", "transcriber_provider": ""
        },
        "cost_breakdown": { "llm": 0, "network": 0, "platform": 0, "synthesizer": 0, "transcriber": 0 },
        "summary": null,
        "status": "no-answer",
        "user_number": "+1 555-0103",
        "provider": "plivo",
        "conversation_type": "Outbound",
        "hangup_by": null
    }
];

interface CallHistoryProps {
    agents?: Agent[];
}

const CallHistory: React.FC<CallHistoryProps> = ({ agents = [] }) => {
  const [logs, setLogs] = useState<CallExecution[]>(MOCK_EXECUTION_DATA);
  const [filteredLogs, setFilteredLogs] = useState<CallExecution[]>(MOCK_EXECUTION_DATA);
  
  // Filter States
  const [selectedAgentId, setSelectedAgentId] = useState('all');
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [dateRange, setDateRange] = useState('Nov 28, 2025 - Dec 05, 2025');
  
  // Details Modal State
  const [selectedLog, setSelectedLog] = useState<CallExecution | null>(null);

  useEffect(() => {
      let result = logs;

      if (selectedAgentId !== 'all') {
          result = result.filter(log => log.agent_id === selectedAgentId);
      }

      if (selectedBatch !== 'all') {
          // Simplistic batch matching logic for demo
          if (selectedBatch === 'batch_a') result = result.filter(log => log.batch_id === 'batch_a');
          if (selectedBatch === 'batch_b') result = result.filter(log => log.batch_id === 'batch_b');
      }

      setFilteredLogs(result);
  }, [selectedAgentId, selectedBatch, logs]);

  const handleRefresh = () => {
      // Simulate fetch
      const shuffled = [...logs].sort(() => 0.5 - Math.random());
      setLogs(shuffled);
  };

  return (
    <div className="space-y-6 pb-10">
      <Filters 
        agents={agents}
        selectedAgentId={selectedAgentId}
        onSelectAgent={setSelectedAgentId}
        selectedBatch={selectedBatch}
        onSelectBatch={setSelectedBatch}
        dateRange={dateRange}
        onRefresh={handleRefresh}
      />

      <Stats logs={filteredLogs} />

      <Table 
        logs={filteredLogs} 
        onViewDetails={setSelectedLog}
      />

      {selectedLog && (
        <CallDetails 
            log={selectedLog} 
            onClose={() => setSelectedLog(null)} 
        />
      )}
    </div>
  );
};

export default CallHistory;
