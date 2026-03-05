const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const SeoMetadata = sequelize.define('SeoMetadata', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        page_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        page_slug: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        meta_title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        meta_description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        robots: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: 'index, follow',
        },
    }, {
        tableName: 'seo_metadata',
        timestamps: true,
    });

    return SeoMetadata;
};
