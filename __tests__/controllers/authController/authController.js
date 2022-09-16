import AuthService from '../../services/authService';
import OAuthService from '../../services/oauthService';
import urls from '../../config/urls';
import * as AuthController from '../../../controllers/authController/authController';
jest.mock('../../services/authService');
describe('mock test', () => {
    it('should work', async () => {
      const userData = {
        id: userId,
        name: 'Allan',
        contacts: [...], 
      };
      const expectedSortedUserdata = {
        user: userData,
        contactsSortedByName: [...],
        contactsSortedByAge: [...],
      };
      AuthService.mockResolvedValue(userData);
      const sortedUserData = await getSortedUserData(userId);
      expect(sortedUserData).toEqual(expectedSortedUserdata);
      expect(getUserData).toHaveBeenCalledTimes(1);
      expect(getUserData).toHaveBeenCalledWith(userId);
    });
  });
