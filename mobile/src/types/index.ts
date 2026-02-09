export interface WebViewError {
  domain: string;
  code: number;
  description: string;
}

export interface NavigationState {
  canGoBack: boolean;
  canGoForward: boolean;
  loading: boolean;
  title: string;
  url: string;
}
