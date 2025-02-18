const User = require('./User');
const Family = require('./Family');
const FamilyMember = require('./FamilyMember');
const Category = require('./Category');
const Ledger = require('./Ledger');
const LedgerEntry = require('./LedgerEntry');

// 设置模型关联关系
// Family 和 FamilyMember 的一对多关系
Family.hasMany(FamilyMember, {
    foreignKey: 'family_id',
    as: 'members'
});
FamilyMember.belongsTo(Family, {
    foreignKey: 'family_id',
    as: 'family'
});

// User 和 FamilyMember 的一对多关系
User.hasMany(FamilyMember, {
    foreignKey: 'openid',
    sourceKey: 'openid',
    as: 'familyMemberships'
});
FamilyMember.belongsTo(User, {
    foreignKey: 'openid',
    targetKey: 'openid',
    as: 'user'
});

// 其他现有的模型关联
User.hasMany(Category, {
    foreignKey: 'openid',
    sourceKey: 'openid',
    as: 'categories'
});
Category.belongsTo(User, {
    foreignKey: 'openid',
    targetKey: 'openid',
    as: 'user'
});

User.hasMany(Ledger, {
    foreignKey: 'openid',
    sourceKey: 'openid',
    as: 'ledgers'
});
Ledger.belongsTo(User, {
    foreignKey: 'openid',
    targetKey: 'openid',
    as: 'user'
});

Ledger.hasMany(LedgerEntry, {
    foreignKey: 'ledger_id',
    as: 'entries'
});
LedgerEntry.belongsTo(Ledger, {
    foreignKey: 'ledger_id',
    as: 'ledger'
});


User.hasMany(LedgerEntry, {
    foreignKey: 'entered_by',
    sourceKey: 'openid',
    as: 'enteredEntries'
});
LedgerEntry.belongsTo(User, {
    foreignKey: 'entered_by',
    targetKey: 'openid',
    as: 'enteredByUser'
});

module.exports = {
    User,
    Family,
    FamilyMember,
    Category,
    Ledger,
    LedgerEntry
};
