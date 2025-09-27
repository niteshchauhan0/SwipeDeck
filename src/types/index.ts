export interface UserProfile {
  id: string;        
  name: string;      
  avatar: string;    
  city: string;
  country: string;
  raw: any;          
}

export type SwipeResult = {
  userId: string;
  liked: boolean;
  at: string; 
};

export type RootStackParamList = {
  Home: undefined;
  Summary: { liked: string[]; disliked: string[] };
};
