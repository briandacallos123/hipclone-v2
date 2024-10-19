// i18n
import 'src/locales/i18n';

// scroll bar
import 'simplebar-react/dist/simplebar.min.css';

// lightbox
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

// map
import 'mapbox-gl/dist/mapbox-gl.css';

// editor
import 'react-quill/dist/quill.snow.css';

// slick-carousel
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// lazy image
import 'react-lazy-load-image-component/src/effects/blur.css';

// others
import './styles.css';
import MerchantContext from '@/context/workforce/merchant/MerchantContext';
// ----------------------------------------------------------------------

// redux
import ReduxProvider from 'src/redux/redux-provider';
// locales
import { LocalizationProvider } from 'src/locales';
// theme
import ThemeProvider from 'src/theme';
import { primaryFont } from 'src/theme/typography';
// components
import ProgressBar from 'src/components/progress-bar';
import MotionLazy from 'src/components/animate/motion-lazy';
import SnackbarProvider from 'src/components/snackbar/snackbar-provider';
import { SettingsProvider, SettingsDrawer } from 'src/components/settings';
// auth
import { AuthProvider, AuthConsumer } from 'src/auth/context';
import Search from '@/auth/context/Search';
import ServiceWorker from 'src/components/ServiceWorker'
import { Viewport } from 'next';
import Checkout from '@/context/checkout/Checkout';
import { getServerSession } from "next-auth";
import SessionProvider from '../context/auth/AuthSession'
import CreateOrder from '@/context/checkout/CreateOrder';
import ChatWrapper from '@/context/components/chat-wrapper';
// ----------------------------------------------------------------------

export const viewport: Viewport = {
  themeColor: '#000000',
}

export const metadata = {
  title: 'HIP',
  description:
    'HIP is a virtual clinic that connects patients to over 7,000 validated doctors nationwide with extensive selection of specialties. It offers services that make medical consultations safer and more convenient.',
  keywords: 'hip,health,information,program,medical,apgitsolutions',
  manifest: '/manifest.json',
  icons: [
    {
      rel: 'icon',
      url: '/favicon/favicon.ico',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon/favicon-16x16.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon/favicon-32x32.png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      url: '/favicon/apple-touch-icon.png',
    },
  ],
};

type Props = {
  children: React.ReactNode;
};



export default async function RootLayout({ children }: Props) {

  const session = await getServerSession()


  return (
    <html lang="en" className={primaryFont.className}>
      <body>
        <AuthProvider>
          <ReduxProvider>
            <LocalizationProvider>
              <SettingsProvider
                defaultSettings={{
                  themeMode: 'light', // 'light' | 'dark'
                  themeDirection: 'ltr', //  'rtl' | 'ltr'
                  themeContrast: 'default', // 'default' | 'bold'
                  themeLayout: 'vertical', // 'vertical' | 'horizontal' | 'mini'
                  themeColorPresets: 'default', // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'green'
                  themeStretch: true,
                }}
              >
                <ThemeProvider>
                  <MotionLazy>
                    <SnackbarProvider>
                      <SettingsDrawer />
                      <ProgressBar />
                      <AuthConsumer>
                        <ServiceWorker/>
                        <Search>
                          <MerchantContext>
                            <Checkout>
                              <CreateOrder>
                                <ChatWrapper>
                                <SessionProvider session={session}>{children}</SessionProvider>

                                </ChatWrapper>
                              </CreateOrder>
                            </Checkout>
                          </MerchantContext>
                        </Search>
                      </AuthConsumer>
                    </SnackbarProvider>
                  </MotionLazy>
                </ThemeProvider>
              </SettingsProvider>
            </LocalizationProvider>
          </ReduxProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
