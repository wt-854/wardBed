import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { WardComponentsPage, WardDeleteDialog, WardUpdatePage } from './ward.page-object';

const expect = chai.expect;

describe('Ward e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let wardComponentsPage: WardComponentsPage;
  let wardUpdatePage: WardUpdatePage;
  let wardDeleteDialog: WardDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Wards', async () => {
    await navBarPage.goToEntity('ward');
    wardComponentsPage = new WardComponentsPage();
    await browser.wait(ec.visibilityOf(wardComponentsPage.title), 5000);
    expect(await wardComponentsPage.getTitle()).to.eq('wardBedApp.ward.home.title');
    await browser.wait(ec.or(ec.visibilityOf(wardComponentsPage.entities), ec.visibilityOf(wardComponentsPage.noResult)), 1000);
  });

  it('should load create Ward page', async () => {
    await wardComponentsPage.clickOnCreateButton();
    wardUpdatePage = new WardUpdatePage();
    expect(await wardUpdatePage.getPageTitle()).to.eq('wardBedApp.ward.home.createOrEditLabel');
    await wardUpdatePage.cancel();
  });

  it('should create and save Wards', async () => {
    const nbButtonsBeforeCreate = await wardComponentsPage.countDeleteButtons();

    await wardComponentsPage.clickOnCreateButton();

    await promise.all([
      wardUpdatePage.setWardReferenceIdInput('WARD_05'),
      wardUpdatePage.setWardNameInput('wardName'),
      wardUpdatePage.wardClassTypeSelectLastOption(),
      wardUpdatePage.wardLocationSelectLastOption()
    ]);

    expect(await wardUpdatePage.getWardReferenceIdInput()).to.eq('WARD_05', 'Expected WardReferenceId value to be equals to WARD_05');
    expect(await wardUpdatePage.getWardNameInput()).to.eq('wardName', 'Expected WardName value to be equals to wardName');

    await wardUpdatePage.save();
    expect(await wardUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await wardComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Ward', async () => {
    const nbButtonsBeforeDelete = await wardComponentsPage.countDeleteButtons();
    await wardComponentsPage.clickOnLastDeleteButton();

    wardDeleteDialog = new WardDeleteDialog();
    expect(await wardDeleteDialog.getDialogTitle()).to.eq('wardBedApp.ward.delete.question');
    await wardDeleteDialog.clickOnConfirmButton();

    expect(await wardComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
