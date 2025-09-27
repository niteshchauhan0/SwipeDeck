import '@testing-library/jest-native/extend-expect';
import 'react-native-gesture-handler/jestSetup';


const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();

jest.mock('react-native/Libraries/LogBox/LogBox', () => ({
  ignoreLogs: () => {},
  ignoreAllLogs: () => {},
}));
